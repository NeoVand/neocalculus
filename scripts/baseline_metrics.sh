#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

WITH_BUILD=0
if [[ "${1:-}" == "--build" ]]; then
	WITH_BUILD=1
fi

if [[ "$WITH_BUILD" -eq 1 ]]; then
	echo "== Running production build =="
	npm run build >/tmp/neocalculus-build.log
	echo "Build log saved to /tmp/neocalculus-build.log"
fi

chapter_lines=0
chapter_count=0
for f in src/lib/chapters/*.svelte; do
	n=$(wc -l <"$f")
	chapter_lines=$((chapter_lines + n))
	chapter_count=$((chapter_count + 1))
done

katex_count=0
for f in src/lib/chapters/*.svelte; do
	c=$(rg -o "<Katex" "$f" | wc -l | tr -d ' ' || true)
	katex_count=$((katex_count + c))
done

callout_count=0
digdeeper_count=0
exercise_count=0
for f in src/lib/chapters/*.svelte; do
	callout_count=$((callout_count + $(rg -o "<Callout" "$f" | wc -l | tr -d ' ' || true)))
	digdeeper_count=$((digdeeper_count + $(rg -o "<DigDeeper" "$f" | wc -l | tr -d ' ' || true)))
	exercise_count=$((exercise_count + $(rg -o "<Exercise" "$f" | wc -l | tr -d ' ' || true)))
done

printf "\n== Content Baseline ==\n"
printf "Date: %s\n" "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
printf "Chapter files: %s\n" "$chapter_count"
printf "Total chapter lines: %s\n" "$chapter_lines"
printf "Total <Katex> usages: %s\n" "$katex_count"
printf "Total <Callout> usages: %s\n" "$callout_count"
printf "Total <DigDeeper> usages: %s\n" "$digdeeper_count"
printf "Total <Exercise> usages: %s\n" "$exercise_count"

client_dir=".svelte-kit/output/client/_app/immutable"
if [[ -d "$client_dir" ]]; then
	printf "\n== Largest Client JS Assets (bytes) ==\n"
	js_files=$(find "$client_dir" -name "*.js" -type f | wc -l | tr -d ' ')
	if [[ "$js_files" -gt 0 ]]; then
		find "$client_dir" -name "*.js" -type f -print0 \
			| xargs -0 stat -f "%z %N" \
			| sort -nr \
			| head -n 10
	else
		echo "No JS assets found in $client_dir"
	fi

	printf "\n== Largest Client CSS Assets (bytes) ==\n"
	css_files=$(find "$client_dir" -name "*.css" -type f | wc -l | tr -d ' ')
	if [[ "$css_files" -gt 0 ]]; then
		find "$client_dir" -name "*.css" -type f -print0 \
			| xargs -0 stat -f "%z %N" \
			| sort -nr \
			| head -n 10
	else
		echo "No CSS assets found in $client_dir"
	fi
else
	printf "\nNo build artifacts found at %s\n" "$client_dir"
	printf "Run: npm run build or npm run metrics:baseline:build\n"
fi
