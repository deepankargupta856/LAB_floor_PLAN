# Laboratory Floor Plan

A lightweight, static 2D SVG floor plan for a placeholder research / AI laboratory.

## Run locally

The page can be opened directly from `index.html`. For a simple localhost preview, run:

```bash
python -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000).

## Update the layout

All important geometry is centralized at the top of `script.js`:

- `room` controls the room width and height in metres.
- `objects` controls furniture, workstations, equipment and service points.
- `SCALE` controls the SVG scale (`100` means 1 metre = 100 SVG units).

The rest of the file generates the SVG from that configuration. Future room, furniture, door, window or equipment changes should be made there so the drawing and summary remain synchronized.

## Export

The page includes SVG and PNG downloads plus browser print support for Print / Save as PDF. Exports contain the drawing itself and its technical labels, without the surrounding website controls.

## Static deployment

This project has no build step, backend, database, API, authentication, dependencies or environment variables. Copy the folder to any static host, including GitHub Pages.
