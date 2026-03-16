#!/usr/bin/env bash
set -euo pipefail

CV_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SITE_ROOT="$(cd "$CV_DIR/.." && pwd)"

TEX_FILE="main.tex"
PDF_TMP="cv.pdf"
PDF_TARGET="$SITE_ROOT/assets/pdf/cv.pdf"

cd "$CV_DIR"

if [[ ! -f "$TEX_FILE" ]]; then
  echo "Error: missing $CV_DIR/$TEX_FILE" >&2
  exit 1
fi

if command -v latexmk >/dev/null 2>&1; then
  echo "Building with latexmk..."
  latexmk -pdf \
    -interaction=nonstopmode \
    -halt-on-error \
    -file-line-error \
    -jobname="${PDF_TMP%.pdf}" \
    "$TEX_FILE"
else
  engine=""
  if command -v xelatex >/dev/null 2>&1; then
    engine="xelatex"
  elif command -v lualatex >/dev/null 2>&1; then
    engine="lualatex"
  elif command -v pdflatex >/dev/null 2>&1; then
    engine="pdflatex"
  fi

  if [[ -z "$engine" ]]; then
    echo "Error: no TeX compiler found (latexmk/xelatex/lualatex/pdflatex)." >&2
    exit 1
  fi

  echo "Building with $engine..."
  "$engine" -interaction=nonstopmode -halt-on-error -file-line-error -jobname="${PDF_TMP%.pdf}" "$TEX_FILE"
  if command -v biber >/dev/null 2>&1; then
    biber "${PDF_TMP%.pdf}" || true
  fi
  "$engine" -interaction=nonstopmode -halt-on-error -file-line-error -jobname="${PDF_TMP%.pdf}" "$TEX_FILE"
  "$engine" -interaction=nonstopmode -halt-on-error -file-line-error -jobname="${PDF_TMP%.pdf}" "$TEX_FILE"
fi

if [[ ! -f "$PDF_TMP" ]]; then
  echo "Error: expected output $CV_DIR/$PDF_TMP not found." >&2
  exit 1
fi

mkdir -p "$(dirname "$PDF_TARGET")"
cp -f "$PDF_TMP" "$PDF_TARGET"

if command -v latexmk >/dev/null 2>&1; then
  latexmk -c -jobname="${PDF_TMP%.pdf}" "$TEX_FILE" >/dev/null 2>&1 || true
fi
rm -f "${PDF_TMP%.pdf}.bbl" comment.cut
rm -f "$PDF_TMP"

echo "Done: $PDF_TARGET"
