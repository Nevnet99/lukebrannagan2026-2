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
	Mesh,
	MeshStandardMaterial,
	type Object3D,
	PerspectiveCamera,
	Scene,
	SRGBColorSpace,
	type Texture,
	TextureLoader,
	WebGLRenderer,
} from "three";

export type BookViewerData = {
	title: string;
	author?: string;
	cover?: string;
	/** Optional real back-cover image URL */
	coverBack?: string;
	description?: string;
	spine?: string;
};

const SPINE_TONES = ["#2f3540", "#1f5c5a", "#3a4150", "#164a48", "#232830", "#2a6b68"] as const;

function prefersReducedMotion() {
	return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function hashTone(title: string): string {
	let h = 0;
	for (let i = 0; i < title.length; i++) h = (h * 31 + title.charCodeAt(i)) | 0;
	return SPINE_TONES[Math.abs(h) % SPINE_TONES.length]!;
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

function finishCanvasTexture(canvas: HTMLCanvasElement): CanvasTexture {
	const texture = new CanvasTexture(canvas);
	texture.colorSpace = SRGBColorSpace;
	texture.generateMipmaps = false;
	texture.minFilter = LinearFilter;
	texture.magFilter = LinearFilter;
	texture.needsUpdate = true;
	return texture;
}

function makeFrontFallback(title: string, author: string, hex: string): CanvasTexture {
	const canvas = document.createElement("canvas");
	canvas.width = 512;
	canvas.height = 768;
	const ctx = canvas.getContext("2d");
	if (!ctx) return finishCanvasTexture(canvas);

	ctx.fillStyle = hex;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
	ctx.fillRect(36, 36, canvas.width - 72, canvas.height - 72);
	ctx.strokeStyle = "rgba(245, 247, 250, 0.2)";
	ctx.lineWidth = 2;
	ctx.strokeRect(48, 48, canvas.width - 96, canvas.height - 96);

	ctx.fillStyle = "rgba(245, 247, 250, 0.96)";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.font = "600 44px Geist, ui-sans-serif, system-ui, sans-serif";
	const maxW = canvas.width - 120;
	let y = 120;
	for (const line of wrapLines(ctx, title, maxW, 5)) {
		ctx.fillText(line, 72, y);
		y += 54;
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
		for (const line of wrapLines(ctx, author, maxW, 2)) {
			ctx.fillText(line, 72, y);
			y += 36;
		}
	}
	return finishCanvasTexture(canvas);
}

function makeSpineTexture(title: string, author: string, hex: string): CanvasTexture {
	const canvas = document.createElement("canvas");
	canvas.width = 256;
	canvas.height = 1024;
	const ctx = canvas.getContext("2d");
	if (!ctx) return finishCanvasTexture(canvas);

	ctx.fillStyle = hex;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.save();
	ctx.translate(canvas.width * 0.55, canvas.height * 0.92);
	ctx.rotate(-Math.PI / 2);
	ctx.fillStyle = "rgba(245, 247, 250, 0.95)";
	ctx.font = "600 48px Geist, ui-sans-serif, system-ui, sans-serif";
	ctx.textBaseline = "middle";
	const label = title.length > 40 ? `${title.slice(0, 38)}…` : title;
	ctx.fillText(label, 0, 0);
	if (author) {
		ctx.font = "500 28px Geist, ui-sans-serif, system-ui, sans-serif";
		ctx.fillStyle = "rgba(245, 247, 250, 0.7)";
		const authorLabel = author.length > 28 ? `${author.slice(0, 26)}…` : author;
		ctx.fillText(authorLabel, 0, 42);
	}
	ctx.restore();
	return finishCanvasTexture(canvas);
}

function makeBackTexture(
	title: string,
	author: string,
	description: string,
	hex: string,
): CanvasTexture {
	const canvas = document.createElement("canvas");
	canvas.width = 512;
	canvas.height = 768;
	const ctx = canvas.getContext("2d");
	if (!ctx) return finishCanvasTexture(canvas);

	ctx.fillStyle = hex;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "rgba(255, 255, 255, 0.06)";
	ctx.fillRect(40, 40, canvas.width - 80, canvas.height - 80);

	ctx.fillStyle = "rgba(245, 247, 250, 0.92)";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.font = "600 32px Geist, ui-sans-serif, system-ui, sans-serif";
	const maxW = canvas.width - 120;
	let y = 88;
	for (const line of wrapLines(ctx, title, maxW, 3)) {
		ctx.fillText(line, 72, y);
		y += 40;
	}

	if (author) {
		y += 8;
		ctx.fillStyle = "rgba(245, 247, 250, 0.7)";
		ctx.font = "500 22px Geist, ui-sans-serif, system-ui, sans-serif";
		ctx.fillText(author, 72, y);
		y += 40;
	}

	y += 12;
	ctx.strokeStyle = "rgba(245, 247, 250, 0.22)";
	ctx.beginPath();
	ctx.moveTo(72, y);
	ctx.lineTo(canvas.width - 72, y);
	ctx.stroke();
	y += 28;

	const blurb =
		description.trim() || "A book on the shelf — open the review for notes when they’re ready.";
	ctx.fillStyle = "rgba(245, 247, 250, 0.82)";
	ctx.font = "400 24px Geist, ui-sans-serif, system-ui, sans-serif";
	for (const line of wrapLines(ctx, blurb, maxW, 12)) {
		ctx.fillText(line, 72, y);
		y += 32;
	}

	return finishCanvasTexture(canvas);
}

function loadColorMap(
	loader: TextureLoader,
	url: string,
	onLoad: (texture: Texture) => void,
	onError: () => void,
) {
	loader.load(
		url,
		(texture) => {
			texture.colorSpace = SRGBColorSpace;
			texture.generateMipmaps = false;
			texture.minFilter = LinearFilter;
			texture.magFilter = LinearFilter;
			onLoad(texture);
		},
		undefined,
		onError,
	);
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

export function initBookViewer(host: HTMLElement, data: BookViewerData) {
	const canvas = host.querySelector("canvas");
	if (!(canvas instanceof HTMLCanvasElement)) return () => {};

	const reduced = prefersReducedMotion();
	const hex = hashTone(data.title);
	const title = data.title;
	const author = data.author ?? "";
	const description = data.description ?? "";

	const scene = new Scene();
	scene.background = null;

	const camera = new PerspectiveCamera(32, 1, 0.1, 40);
	camera.position.set(0, 0.15, 4.2);
	camera.lookAt(0, 0, 0);

	const renderer = new WebGLRenderer({
		canvas,
		antialias: true,
		alpha: true,
		powerPreference: "high-performance",
	});
	renderer.setClearColor(0x000000, 0);
	renderer.setClearAlpha(0);
	renderer.outputColorSpace = SRGBColorSpace;

	scene.add(new AmbientLight(0xfff6ea, 0.55));
	const hemi = new HemisphereLight(0xfff2e0, 0x2a3038, 0.4);
	scene.add(hemi);
	const key = new DirectionalLight(0xfff4e8, 1.1);
	key.position.set(2.5, 4, 5);
	scene.add(key);
	const fill = new DirectionalLight(0xb8c4d4, 0.35);
	fill.position.set(-3, 1, 2);
	scene.add(fill);

	const loader = new TextureLoader();
	const root = new Group();
	scene.add(root);

	const width = 1.15;
	const height = 1.72;
	const depth = 0.22;

	const frontMat = new MeshStandardMaterial({ color: "#ffffff", roughness: 0.72 });
	const backMat = new MeshStandardMaterial({ color: "#ffffff", roughness: 0.72 });
	const spineMat = new MeshStandardMaterial({ color: "#ffffff", roughness: 0.78 });
	const pageMat = new MeshStandardMaterial({ color: new Color("#ebe6da"), roughness: 0.95 });
	const edgeMat = new MeshStandardMaterial({
		color: new Color(hex).multiplyScalar(0.7),
		roughness: 0.88,
	});

	frontMat.map = makeFrontFallback(title, author, hex);
	backMat.map = makeBackTexture(title, author, description, hex);
	spineMat.map = makeSpineTexture(title, author, hex);

	if (data.cover) {
		loadColorMap(
			loader,
			data.cover,
			(texture) => {
				frontMat.map?.dispose();
				frontMat.map = texture;
				frontMat.needsUpdate = true;
			},
			() => {},
		);
	}

	if (data.coverBack) {
		loadColorMap(
			loader,
			data.coverBack,
			(texture) => {
				backMat.map?.dispose();
				backMat.map = texture;
				backMat.needsUpdate = true;
			},
			() => {},
		);
	}

	if (data.spine) {
		loadColorMap(
			loader,
			data.spine,
			(texture) => {
				spineMat.map?.dispose();
				spineMat.map = texture;
				spineMat.needsUpdate = true;
			},
			() => {},
		);
	}

	// +x pages, -x spine, +y/-y edges, +z front, -z back
	const materials = [pageMat, spineMat, edgeMat, edgeMat, frontMat, backMat];
	const mesh = new Mesh(new BoxGeometry(width, height, depth), materials);
	root.add(mesh);

	// Slight tilt so spine reads while spinning
	root.rotation.x = 0.08;
	root.rotation.z = -0.04;
	if (reduced) {
		root.rotation.y = -0.55;
	}

	const clock = new Clock();
	let frame = 0;
	let running = true;
	let dragging = false;
	let lastX = 0;
	let lastY = 0;
	let velocityY = 0;
	const baseTiltX = root.rotation.x;
	const AUTO_SPIN = 0.45;

	const resize = () => {
		const rect = host.getBoundingClientRect();
		const w = Math.max(1, Math.floor(rect.width));
		const h = Math.max(1, Math.floor(rect.height));
		camera.aspect = w / h;
		camera.updateProjectionMatrix();
		renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.5));
		renderer.setSize(w, h, false);
	};

	const tick = () => {
		if (!running) return;
		frame = window.requestAnimationFrame(tick);
		const delta = Math.min(clock.getDelta(), 0.05);

		if (!dragging) {
			if (Math.abs(velocityY) > 0.002) {
				root.rotation.y += velocityY;
				velocityY *= 0.92;
			} else if (!reduced) {
				velocityY = 0;
				root.rotation.y += delta * AUTO_SPIN;
			}
		}

		renderer.render(scene, camera);
	};

	const onPointerDown = (event: PointerEvent) => {
		dragging = true;
		velocityY = 0;
		lastX = event.clientX;
		lastY = event.clientY;
		host.setPointerCapture(event.pointerId);
		host.classList.add("is-dragging");
		event.preventDefault();
	};

	const onPointerMove = (event: PointerEvent) => {
		if (!dragging) return;
		const dx = event.clientX - lastX;
		const dy = event.clientY - lastY;
		lastX = event.clientX;
		lastY = event.clientY;

		const yaw = dx * 0.012;
		root.rotation.y += yaw;
		velocityY = yaw;

		root.rotation.x = Math.min(0.45, Math.max(-0.2, root.rotation.x + dy * 0.008));
	};

	const onPointerUp = (event: PointerEvent) => {
		if (!dragging) return;
		dragging = false;
		host.classList.remove("is-dragging");
		try {
			host.releasePointerCapture(event.pointerId);
		} catch {
			/* already released */
		}
		// Ease tilt back toward the resting angle
		const settle = () => {
			if (dragging || !running) return;
			root.rotation.x += (baseTiltX - root.rotation.x) * 0.12;
			if (Math.abs(root.rotation.x - baseTiltX) > 0.004) {
				requestAnimationFrame(settle);
			} else {
				root.rotation.x = baseTiltX;
			}
		};
		requestAnimationFrame(settle);
	};

	resize();
	tick();

	const ro = new ResizeObserver(resize);
	ro.observe(host);
	host.addEventListener("pointerdown", onPointerDown);
	host.addEventListener("pointermove", onPointerMove);
	host.addEventListener("pointerup", onPointerUp);
	host.addEventListener("pointercancel", onPointerUp);
	host.addEventListener("lostpointercapture", onPointerUp);

	return () => {
		running = false;
		window.cancelAnimationFrame(frame);
		ro.disconnect();
		host.removeEventListener("pointerdown", onPointerDown);
		host.removeEventListener("pointermove", onPointerMove);
		host.removeEventListener("pointerup", onPointerUp);
		host.removeEventListener("pointercancel", onPointerUp);
		host.removeEventListener("lostpointercapture", onPointerUp);
		host.classList.remove("is-dragging");
		disposeObject(root);
		renderer.dispose();
	};
}

export function mountBookViewer() {
	const host = document.querySelector<HTMLElement>("[data-book-viewer]");
	if (!host) return;

	let data: BookViewerData = { title: "Book" };
	try {
		data = JSON.parse(host.dataset.book ?? "{}") as BookViewerData;
	} catch {
		return;
	}

	initBookViewer(host, data);
}
