import { formatHex, wcagContrast } from "culori";

/** Remeasure the live Mist + Tide semantic pairs used in colors.css */
const mist = {
	50: { mode: "oklch", l: 0.975, c: 0.002, h: 250 },
	100: { mode: "oklch", l: 0.95, c: 0.004, h: 250 },
	200: { mode: "oklch", l: 0.9, c: 0.007, h: 250 },
	400: { mode: "oklch", l: 0.72, c: 0.014, h: 250 },
	500: { mode: "oklch", l: 0.62, c: 0.018, h: 250 },
	600: { mode: "oklch", l: 0.52, c: 0.016, h: 250 },
	700: { mode: "oklch", l: 0.42, c: 0.013, h: 250 },
	800: { mode: "oklch", l: 0.32, c: 0.008, h: 250 },
	900: { mode: "oklch", l: 0.24, c: 0.005, h: 250 },
	950: { mode: "oklch", l: 0.17, c: 0.003, h: 250 },
};

const tide = {
	300: { mode: "oklch", l: 0.82, c: 0.045, h: 195 },
	400: { mode: "oklch", l: 0.72, c: 0.06, h: 195 },
	600: { mode: "oklch", l: 0.52, c: 0.07, h: 195 },
	700: { mode: "oklch", l: 0.42, c: 0.055, h: 195 },
};

function check(label, fg, bg, need) {
	const r = wcagContrast(fg, bg);
	const ok = r >= need;
	console.log(
		`${ok ? "PASS" : "FAIL"} ${label}: ${r.toFixed(2)}:1 (need ≥${need})  ${formatHex(fg)} on ${formatHex(bg)}`,
	);
	return ok;
}

let ok = true;
console.log("Light — Mist + Tide");
ok &&= check("body", mist[950], mist[50], 4.5);
ok &&= check("muted", mist[700], mist[50], 4.5);
ok &&= check("subtle UI", mist[600], mist[50], 3);
ok &&= check("accent text", tide[700], mist[50], 4.5);
ok &&= check("on-accent / solid", mist[50], tide[600], 4.5);
ok &&= check("focus UI", tide[600], mist[50], 3);
ok &&= check("border-strong UI", mist[500], mist[50], 3);

console.log("\nDark — Mist + Tide");
ok &&= check("body", mist[50], mist[950], 4.5);
ok &&= check("muted", mist[400], mist[950], 4.5);
ok &&= check("subtle UI", mist[500], mist[950], 3);
ok &&= check("accent text", tide[300], mist[950], 4.5);
ok &&= check("on-accent / solid", mist[950], tide[400], 4.5);
ok &&= check("focus UI", tide[400], mist[950], 3);
ok &&= check("border-strong UI", mist[600], mist[950], 3);

console.log(ok ? "\nAll measured pairs pass." : "\nSome pairs failed.");
process.exit(ok ? 0 : 1);
