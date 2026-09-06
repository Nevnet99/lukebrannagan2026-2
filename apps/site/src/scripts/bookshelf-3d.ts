import {
	AmbientLight,
	BoxGeometry,
	CanvasTexture,
	Clock,
	Color,
	DirectionalLight,
	Group,
	HemisphereLight,
	LinearFilter,
	MathUtils,
	Mesh,
	MeshStandardMaterial,
	type Object3D,
	PCFSoftShadowMap,
	PerspectiveCamera,
	Raycaster,
	RepeatWrapping,
	Scene,
	SRGBColorSpace,
	TextureLoader,
	Vector2,
	WebGLRenderer,
} from "three";

export type Bookshelf3DBook = {
	id: string;
	title: string;
	author?: string;
	href: string;
	cover?: string;
};

type BookUnit = {
	group: Group;
	mesh: Mesh;
	href: string;
	restX: number;
	restY: number;
	restZ: number;
	restRotZ: number;
	hover: number;
};

const SPINE_HEX = ["#2f3540", "#1f5c5a", "#3a4150", "#164a48", "#232830", "#2a6b68"] as const;

const WOOD = {
	face: "#8b7355",
	dark: "#5a4836",
	inner: "#3d342c",
} as const;

function prefersReducedMotion() {
	return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function makeWoodTexture(base: string, accent: string, w = 256, h = 256): CanvasTexture {
	const canvas = document.createElement("canvas");
	canvas.width = w;
	canvas.height = h;
	const ctx = canvas.getContext("2d");
	if (!ctx) return new CanvasTexture(canvas);

	ctx.fillStyle = base;
	ctx.fillRect(0, 0, w, h);

	for (let i = 0; i < 28; i++) {
		const y = (i / 28) * h + Math.sin(i * 1.7) * 3;
		ctx.strokeStyle = accent;
		ctx.globalAlpha = 0.08 + (i % 4) * 0.02;
		ctx.lineWidth = 1 + (i % 3);
		ctx.beginPath();
		ctx.moveTo(0, y);
		ctx.bezierCurveTo(w * 0.3, y + 4, w * 0.7, y - 3, w, y + 2);
		ctx.stroke();
	}
	ctx.globalAlpha = 1;

	const texture = new CanvasTexture(canvas);
	texture.colorSpace = SRGBColorSpace;
	texture.wrapS = RepeatWrapping;
	texture.wrapT = RepeatWrapping;
	return texture;
}

function wrapLines(
	ctx: CanvasRenderingContext2D,
	text: string,
	maxWidth: number,
	maxLines: number,
): string[] {
	const words = text.split(/\s+/).filter(Boolean);
	const lines: string[] = [];
	let current = "";

	const pushClipped = (value: string) => {
		let clipped = value;
		while (clipped.length > 1 && ctx.measureText(`${clipped}…`).width > maxWidth) {
			clipped = clipped.slice(0, -1);
		}
		lines.push(clipped === value ? value : `${clipped}…`);
	};

	for (const word of words) {
		const next = current ? `${current} ${word}` : word;
		if (ctx.measureText(next).width <= maxWidth) {
			current = next;
			continue;
		}
		if (current) {
			if (lines.length >= maxLines - 1) {
				pushClipped([current, word, ...words.slice(words.indexOf(word) + 1)].join(" "));
				return lines.slice(0, maxLines);
			}
			lines.push(current);
		}
		current = word;
	}

	if (current) {
		if (lines.length >= maxLines) return lines.slice(0, maxLines);
		if (ctx.measureText(current).width > maxWidth) pushClipped(current);
		else lines.push(current);
	}

	return lines.slice(0, maxLines);
}

function makeCoverFallbackTexture(title: string, author: string, hex: string): CanvasTexture {
	const canvas = document.createElement("canvas");
	canvas.width = 512;
	canvas.height = 768;
	const ctx = canvas.getContext("2d");
	if (!ctx) return new CanvasTexture(canvas);

	ctx.fillStyle = hex;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	// Subtle inner panel
	ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
	ctx.fillRect(36, 36, canvas.width - 72, canvas.height - 72);
	ctx.strokeStyle = "rgba(245, 247, 250, 0.18)";
	ctx.lineWidth = 2;
	ctx.strokeRect(48, 48, canvas.width - 96, canvas.height - 96);

	const textMax = canvas.width - 120;
	ctx.fillStyle = "rgba(245, 247, 250, 0.96)";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.font = "600 44px Geist, ui-sans-serif, system-ui, sans-serif";

	const titleLines = wrapLines(ctx, title, textMax, 5);
	let y = 120;
	const titleLineH = 54;
	for (const line of titleLines) {
		ctx.fillText(line, 72, y);
		y += titleLineH;
	}

	if (author) {
		y += 28;
		ctx.strokeStyle = "rgba(245, 247, 250, 0.28)";
		ctx.beginPath();
		ctx.moveTo(72, y);
		ctx.lineTo(180, y);
		ctx.stroke();
		y += 28;
		ctx.fillStyle = "rgba(245, 247, 250, 0.78)";
		ctx.font = "500 28px Geist, ui-sans-serif, system-ui, sans-serif";
		const authorLines = wrapLines(ctx, author, textMax, 2);
		for (const line of authorLines) {
			ctx.fillText(line, 72, y);
			y += 36;
		}
	}

	const texture = new CanvasTexture(canvas);
	texture.colorSpace = SRGBColorSpace;
	texture.generateMipmaps = false;
	texture.minFilter = LinearFilter;
	texture.magFilter = LinearFilter;
	texture.needsUpdate = true;
	return texture;
}

function makeSpineTexture(title: string, hex: string): CanvasTexture {
	// High-res canvas + no mipmaps keeps spine titles crisp when zoomed in
	const canvas = document.createElement("canvas");
	canvas.width = 256;
	canvas.height = 1024;
	const ctx = canvas.getContext("2d");
	if (!ctx) return new CanvasTexture(canvas);

	ctx.imageSmoothingEnabled = true;
	ctx.imageSmoothingQuality = "high";
	ctx.fillStyle = hex;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.save();
	ctx.translate(canvas.width * 0.56, canvas.height * 0.94);
	ctx.rotate(-Math.PI / 2);
	ctx.fillStyle = "rgba(245, 247, 250, 0.95)";
	ctx.font = "600 52px Geist, ui-sans-serif, system-ui, sans-serif";
	ctx.textBaseline = "middle";
	const label = title.length > 36 ? `${title.slice(0, 34)}…` : title;
	ctx.fillText(label, 0, 0);
	ctx.restore();

	const texture = new CanvasTexture(canvas);
	texture.colorSpace = SRGBColorSpace;
	texture.generateMipmaps = false;
	texture.minFilter = LinearFilter;
	texture.magFilter = LinearFilter;
	texture.needsUpdate = true;
	return texture;
}

function disposeObject(root: Object3D) {
	const seenGeo = new Set<unknown>();
	const seenMat = new Set<unknown>();
	root.traverse((obj) => {
		const mesh = obj as Mesh;
		if (!mesh.isMesh) return;
		if (!seenGeo.has(mesh.geometry)) {
			seenGeo.add(mesh.geometry);
			mesh.geometry.dispose();
		}
		const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
		for (const mat of materials) {
			if (seenMat.has(mat)) continue;
			seenMat.add(mat);
			const std = mat as MeshStandardMaterial;
			std.map?.dispose();
			std.dispose();
		}
	});
}

function bookMetrics(index: number) {
	// Slightly thicker spines so titles read at rest
	const thickness = 0.26 + (index % 3 === 0 ? 0.05 : 0) + (index % 2) * 0.02;
	const height = 1.48 + (index % 2 === 0 ? 0.1 : -0.06) + (index % 5 === 0 ? 0.08 : 0);
	const depth = 1.05;
	return { thickness, height, depth };
}

export function initBookshelf3D(host: HTMLElement, books: Bookshelf3DBook[]) {
	if (books.length === 0) return () => {};

	const canvas = host.querySelector("canvas");
	if (!(canvas instanceof HTMLCanvasElement)) return () => {};

	let reduced = prefersReducedMotion();
	const clock = new Clock();
	const scene = new Scene();
	scene.background = null;

	const camera = new PerspectiveCamera(28, 1, 0.1, 50);

	const renderer = new WebGLRenderer({
		canvas,
		antialias: true,
		alpha: true,
		powerPreference: "high-performance",
	});
	renderer.setClearColor(0x000000, 0);
	renderer.setClearAlpha(0);
	renderer.outputColorSpace = SRGBColorSpace;
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = PCFSoftShadowMap;

	// Studio-ish three-point + soft sky/ground fill (threejs-lighting)
	scene.add(new AmbientLight(0xfff6ea, 0.48));
	const hemi = new HemisphereLight(0xfff2e0, 0x3d342c, 0.45);
	hemi.position.set(0, 8, 0);
	scene.add(hemi);

	const key = new DirectionalLight(0xfff4e8, 1.0);
	key.position.set(3.2, 7, 6);
	key.castShadow = true;
	key.shadow.mapSize.set(2048, 2048);
	key.shadow.radius = 2;
	key.shadow.bias = -0.00015;
	key.shadow.normalBias = 0.018;
	scene.add(key);

	const fill = new DirectionalLight(0xb8c4d4, 0.35);
	fill.position.set(-5, 2, 4);
	scene.add(fill);

	const rim = new DirectionalLight(0xffffff, 0.22);
	rim.position.set(0, 2, -4);
	scene.add(rim);

	const loader = new TextureLoader();
	const raycaster = new Raycaster();
	const pointer = new Vector2(2, 2);
	let lastRaycast = 0;

	const mid = Math.ceil(books.length / 2);
	const rows = [books.slice(0, mid), books.slice(mid)].filter((row) => row.length > 0);

	const units: BookUnit[] = [];
	const pickables: Mesh[] = [];
	const root = new Group();
	scene.add(root);

	const GAP = 0.018;
	const SIDE = 0.18;
	const BACK = 0.1;
	const SHELF_T = 0.14;
	const TOP_T = 0.16;
	const INNER_PAD_X = 0.12;
	const BAY_CLEARANCE = 0.22;
	const CASE_DEPTH = 1.45;

	const maxAniso = renderer.capabilities.getMaxAnisotropy();
	const woodMap = makeWoodTexture(WOOD.face, WOOD.dark, 512, 256);
	woodMap.anisotropy = maxAniso;
	woodMap.repeat.set(2, 1);

	const woodMat = new MeshStandardMaterial({
		map: woodMap,
		color: new Color("#c4a882"),
		roughness: 0.82,
		metalness: 0.02,
	});
	const woodDarkMat = new MeshStandardMaterial({
		color: new Color(WOOD.dark),
		roughness: 0.88,
	});
	const innerMat = new MeshStandardMaterial({
		color: new Color(WOOD.inner),
		roughness: 0.95,
	});
	// Shared across books (threejs-materials / geometry tips)
	const sharedPageMat = new MeshStandardMaterial({
		color: new Color("#ebe6da"),
		roughness: 0.95,
	});

	const rowPacks = rows.map((row) => {
		const metrics = row.map((_, i) => bookMetrics(i));
		const widths = metrics.map((m) => m.thickness);
		const packed = widths.reduce((sum, w) => sum + w, 0) + GAP * Math.max(0, row.length - 1);
		const maxH = Math.max(...metrics.map((m) => m.height));
		return { row, metrics, packed, maxH };
	});

	const innerW = Math.max(...rowPacks.map((p) => p.packed)) + INNER_PAD_X * 2;
	const outerW = innerW + SIDE * 2;
	const bayH = Math.max(...rowPacks.map((p) => p.maxH)) + BAY_CLEARANCE;
	const shelfCount = rows.length;
	const caseH = TOP_T + shelfCount * bayH + (shelfCount + 1) * SHELF_T;

	const caseGroup = new Group();
	root.add(caseGroup);

	const back = new Mesh(new BoxGeometry(outerW - SIDE * 0.2, caseH - TOP_T * 0.3, BACK), innerMat);
	back.position.set(0, caseH / 2, -CASE_DEPTH / 2 + BACK / 2);
	back.receiveShadow = true;
	caseGroup.add(back);

	const left = new Mesh(new BoxGeometry(SIDE, caseH, CASE_DEPTH), woodMat);
	left.position.set(-outerW / 2 + SIDE / 2, caseH / 2, 0);
	left.castShadow = true;
	left.receiveShadow = true;
	caseGroup.add(left);

	const right = new Mesh(new BoxGeometry(SIDE, caseH, CASE_DEPTH), woodMat);
	right.position.set(outerW / 2 - SIDE / 2, caseH / 2, 0);
	right.castShadow = true;
	right.receiveShadow = true;
	caseGroup.add(right);

	const top = new Mesh(new BoxGeometry(outerW + 0.08, TOP_T, CASE_DEPTH + 0.06), woodMat);
	top.position.set(0, caseH - TOP_T / 2, 0.02);
	top.castShadow = true;
	top.receiveShadow = true;
	caseGroup.add(top);

	const fascia = new Mesh(new BoxGeometry(outerW - SIDE * 0.5, 0.06, 0.05), woodDarkMat);
	fascia.position.set(0, caseH - TOP_T - 0.03, CASE_DEPTH / 2 - 0.02);
	caseGroup.add(fascia);

	const shelfYs: number[] = [];
	for (let s = 0; s <= shelfCount; s++) {
		const y = SHELF_T / 2 + s * (bayH + SHELF_T);
		shelfYs.push(y);
		const shelf = new Mesh(
			new BoxGeometry(innerW + 0.04, SHELF_T, CASE_DEPTH - BACK * 0.6),
			woodMat,
		);
		shelf.position.set(0, y, BACK * 0.15);
		shelf.receiveShadow = true;
		shelf.castShadow = true;
		caseGroup.add(shelf);

		const lip = new Mesh(new BoxGeometry(innerW + 0.04, SHELF_T * 0.92, 0.04), woodDarkMat);
		lip.position.set(0, y, CASE_DEPTH / 2 - 0.04);
		caseGroup.add(lip);
	}

	// Tight shadow frustum around the case (threejs-lighting)
	const shadowPad = Math.max(outerW, caseH) * 0.65;
	key.shadow.camera.left = -shadowPad;
	key.shadow.camera.right = shadowPad;
	key.shadow.camera.top = shadowPad;
	key.shadow.camera.bottom = -shadowPad;
	key.shadow.camera.near = 1;
	key.shadow.camera.far = 28;
	key.shadow.camera.updateProjectionMatrix();

	caseGroup.position.y = -caseH / 2;

	rowPacks.forEach((pack, rowIndex) => {
		const shelfTop = shelfYs[rowIndex]! + SHELF_T / 2;
		let cursor = -pack.packed / 2;

		pack.row.forEach((book, index) => {
			const { thickness, height, depth } = pack.metrics[index]!;
			const hex = SPINE_HEX[(rowIndex * 7 + index) % SPINE_HEX.length]!;

			const spineMap = makeSpineTexture(book.title, hex);

			const edgeMat = new MeshStandardMaterial({
				color: new Color(hex).multiplyScalar(0.72),
				roughness: 0.85,
			});
			const spineMat = new MeshStandardMaterial({
				map: spineMap,
				roughness: 0.78,
			});
			const coverMat = new MeshStandardMaterial({
				color: new Color("#ffffff"),
				roughness: 0.7,
			});

			if (book.cover) {
				loader.load(
					book.cover,
					(texture) => {
						texture.colorSpace = SRGBColorSpace;
						texture.anisotropy = maxAniso;
						texture.minFilter = LinearFilter;
						texture.magFilter = LinearFilter;
						texture.generateMipmaps = false;
						coverMat.map = texture;
						coverMat.needsUpdate = true;
					},
					undefined,
					() => {
						coverMat.map = makeCoverFallbackTexture(book.title, book.author ?? "", hex);
						coverMat.needsUpdate = true;
					},
				);
			} else {
				coverMat.map = makeCoverFallbackTexture(book.title, book.author ?? "", hex);
			}

			// +x cover, -x pages, +y/-y edges, +z spine, -z back
			const materials = [coverMat, sharedPageMat, edgeMat, edgeMat, spineMat, edgeMat];
			const geometry = new BoxGeometry(thickness, height, depth);
			const mesh = new Mesh(geometry, materials);
			mesh.position.set(0, height / 2, 0);
			mesh.castShadow = true;
			mesh.receiveShadow = true;
			mesh.userData.href = book.href;

			const restX = cursor + thickness / 2;
			cursor += thickness + GAP;

			const restY = shelfTop;
			const restZ = -CASE_DEPTH / 2 + BACK + depth / 2 + 0.06;
			const restRotZ = (index % 2 === 0 ? -1 : 1) * (0.008 + (index % 3) * 0.003);

			const group = new Group();
			group.position.set(restX, restY, restZ);
			group.rotation.z = restRotZ;
			group.add(mesh);
			caseGroup.add(group);

			units.push({
				group,
				mesh,
				href: book.href,
				restX,
				restY,
				restZ,
				restRotZ,
				hover: 0,
			});
			pickables.push(mesh);
		});
	});

	let hovered: BookUnit | null = null;
	let frame = 0;
	let running = true;

	const frameCamera = (aspect: number) => {
		// Leave headroom so crown + bottom shelf read clearly; room for pull-out
		const fitH = caseH * 1.16;
		const fitW = outerW * 1.1;
		const vFov = (camera.fov * Math.PI) / 180;
		const distForH = fitH / (2 * Math.tan(vFov / 2));
		const distForW = fitW / (2 * Math.tan(vFov / 2) * aspect);
		const dist = Math.max(distForH, distForW) + 0.85;
		camera.position.set(0, 0.02, dist);
		camera.lookAt(0, 0, 0);
		camera.near = 0.1;
		camera.far = dist + 20;
		camera.updateProjectionMatrix();
	};

	const resize = () => {
		const rect = host.getBoundingClientRect();
		const width = Math.max(1, Math.floor(rect.width));
		const height = Math.max(1, Math.floor(rect.height));
		camera.aspect = width / height;
		frameCamera(camera.aspect);
		// Prefer sharp pixels on retina; 2x is usually enough, allow 2.5 on high-DPI
		renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.5));
		renderer.setSize(width, height, false);
	};

	const setPointerFromEvent = (event: PointerEvent) => {
		const rect = canvas.getBoundingClientRect();
		pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
		pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
	};

	const pick = () => {
		raycaster.setFromCamera(pointer, camera);
		const hits = raycaster.intersectObjects(pickables, false);
		if (hits.length === 0) return null;
		const mesh = hits[0]?.object as Mesh | undefined;
		if (!mesh) return null;
		return units.find((unit) => unit.mesh === mesh) ?? null;
	};

	const onPointerMove = (event: PointerEvent) => {
		setPointerFromEvent(event);
		// Throttle hover raycasts (threejs-interaction)
		const now = performance.now();
		if (now - lastRaycast < 40) return;
		lastRaycast = now;
		const next = pick();
		hovered = next;
		host.style.cursor = next ? "pointer" : "default";
	};

	const onPointerLeave = () => {
		pointer.set(2, 2);
		hovered = null;
		host.style.cursor = "default";
	};

	const onClick = (event: PointerEvent) => {
		setPointerFromEvent(event);
		const hit = pick();
		if (hit) window.location.assign(hit.href);
	};

	const tick = () => {
		if (!running) return;
		frame = window.requestAnimationFrame(tick);
		const delta = Math.min(clock.getDelta(), 0.05);
		const damp = reduced ? 40 : 10;

		for (const unit of units) {
			const target = hovered === unit ? 1 : 0;
			unit.hover = MathUtils.damp(unit.hover, target, damp, delta);

			const t = unit.hover;
			// Phase the motion: slide out first, then turn to show the cover
			// Three.js MathUtils.smoothstep(x, min, max) — x first, unlike GLSL
			const pull = MathUtils.smoothstep(t, 0, 0.55);
			const turn = MathUtils.smoothstep(t, 0.4, 1);

			unit.group.position.x = unit.restX + turn * 0.04;
			unit.group.position.y = unit.restY + pull * 0.04;
			unit.group.position.z = unit.restZ + pull * 1.45;
			unit.group.rotation.y = turn * -1.05;
			unit.group.rotation.z = unit.restRotZ * (1 - pull);
			const scale = 1 + pull * 0.04 + turn * 0.04;
			unit.group.scale.set(scale, scale, scale);
		}

		renderer.render(scene, camera);
	};

	resize();
	tick();

	const ro = new ResizeObserver(resize);
	ro.observe(host);
	canvas.addEventListener("pointermove", onPointerMove);
	canvas.addEventListener("pointerleave", onPointerLeave);
	canvas.addEventListener("click", onClick);

	const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
	const onMotion = () => {
		reduced = mq.matches;
	};
	mq.addEventListener?.("change", onMotion);

	return () => {
		running = false;
		window.cancelAnimationFrame(frame);
		ro.disconnect();
		mq.removeEventListener?.("change", onMotion);
		canvas.removeEventListener("pointermove", onPointerMove);
		canvas.removeEventListener("pointerleave", onPointerLeave);
		canvas.removeEventListener("click", onClick);
		disposeObject(root);
		renderer.dispose();
	};
}

export function mountBookshelf3D() {
	const host = document.querySelector<HTMLElement>("[data-bookshelf-3d]");
	if (!host) return;

	const raw = host.dataset.books ?? "[]";
	let books: Bookshelf3DBook[] = [];
	try {
		books = JSON.parse(raw) as Bookshelf3DBook[];
	} catch {
		return;
	}

	const desktop = window.matchMedia("(min-width: 40rem)");
	let dispose: (() => void) | undefined;

	const sync = () => {
		dispose?.();
		dispose = undefined;
		if (desktop.matches) {
			dispose = initBookshelf3D(host, books);
		}
	};

	sync();
	desktop.addEventListener("change", sync);
}
