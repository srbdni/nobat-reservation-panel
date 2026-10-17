# Nobat | Reservation Panel

A reservation and customer management panel with a Persian, right-to-left (RTL) user interface, built with **React, TypeScript, and Vite**.

This project is a **standalone frontend application**: its current version does not require an API server or database and stores data in the browser's `localStorage`. It is therefore best suited for portfolio projects, demos, and early-stage development rather than a production, multi-user system.

## Features

- Create reservations with a customer's name, mobile number, service, date, time, and optional notes
- View reservation details and change their status between "Pending," "Confirmed," and "Cancelled"
- View all reservations or only today's reservations, along with status statistics
- Search by name or mobile number; filter by status and date; sort and paginate results
- View customers grouped by mobile number, including their reservation count and most recent reservation
- **Export reservations matching the current filters to CSV**
- Save changes locally, display storage errors, and restore sample data
- Responsive interface, Vazir Persian font, RTL layout, and success/error notifications

## Tech Stack

| Technology | Role in the Project |
| --- | --- |
| React 19 and React DOM | Building a component-based user interface |
| TypeScript 5.8 | Defining data types and performing static type checks |
| Vite 6 | Development server, production build, and build preview |
| Plain CSS | Implementing a responsive design without a CSS framework |
| Lucide React | User interface icons |
| React Context and custom hooks | Sharing reservation data, notifications, and page logic |
| Web Storage (`localStorage`) | Storing data in the browser |
| `Intl.DateTimeFormat` | Calculating dates in the Tehran time zone and displaying dates in a Persian format |
| Node.js Test Runner and `tsx` | Running application logic tests |
| Prettier | Code formatting |

## Prerequisites

- **Node.js version `20.19.0` or later** (as specified in `package.json`)
- `npm` to install dependencies
- A modern web browser

## Installation and Local Development

1. Extract the project archive and navigate in your terminal to the directory containing `package.json`:

```bash
cd nobat-reservation-panel
```

2. Install dependencies using the existing `package-lock.json`:

```bash
npm ci
```

> If you intentionally want to resolve dependencies again instead of using the existing lockfile, you can run `npm install`. For reproducible installs, `npm ci` is recommended.

3. Start the development server:

```bash
npm run dev
```

Open the URL shown in the terminal in your browser (typically `http://localhost:5173`). With the current configuration, Vite runs with `--host 0.0.0.0`, which means it may also be accessible from other devices on the network, depending on network and firewall settings.

**Note:** You do not need a `.env` file, backend, or database to start this version.

## Production Build and Preview

```bash
npm run build
npm run preview
```

The `build` command first runs the TypeScript check (`tsc -b`) and then the Vite build. Deployable files are generated in the `dist/` directory. The `preview` command serves the built version locally (usually at `http://localhost:4173`).

To deploy, host the contents of `dist/` on a static file host. In the current configuration, font file paths use `/fonts/...`, so deploying to a subpath (such as `/app/`) may require adjusting asset paths.

## Testing and Formatting

```bash
npm test
npm run format
```

- `npm test` runs tests from `tests/*.test.ts` using Node.js and `tsx`. They cover scenarios such as form validation, Tehran dates, searching, status changes, storage, and CSV export.
- `npm run format` **rewrites** files in `src` and `tests` using Prettier.

## Project Structure

```text
nobat-reservation-panel/
├── public/fonts/              # Vazir font files
├── src/
│   ├── components/            # Forms, tables, filters, modals, and UI components
│   ├── context/               # Shared reservation data and notifications
│   ├── domain/                # Business rules, validation, and data selection
│   ├── hooks/                 # Reservation, filtering, and status-editing logic
│   ├── layout/                # Page layouts and navigation
│   ├── lib/                   # Date, text, and sample-data utilities
│   ├── pages/                 # Reservations and customers pages
│   ├── services/              # Browser storage and CSV export
│   ├── styles/                # Separate CSS files
│   ├── App.tsx
│   ├── main.tsx
│   └── types.ts                # Data models and types
├── tests/                     # Unit tests for project logic
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
└── vite.config.ts
```

## Data Model and Reservation Rules

Each reservation includes `id`, `name`, `phone`, `service`, `date`, `time`, `notes`, and `status`. A new reservation ID is generated using `crypto.randomUUID()`, and its initial status is `pending`.

Key form validation rules:

- **Name:** Between **3 and 70** characters
- **Mobile number:** An 11-digit Iranian mobile number matching `09xxxxxxxxx`; Persian and Arabic numerals are normalized during processing
- **Service:** One of the options defined in `src/domain/constants.ts`
- **Date:** A valid Gregorian date in `YYYY-MM-DD` format that is not in the past
- **Time:** In `HH:mm` format and, for new reservations, later than the current time **in Tehran**
- **Notes:** Up to **500** characters
- **Conflicts:** The same **mobile number** cannot have two active reservations at the same date and time; reservations with `cancelled` status do not count as conflicts. This rule does **not** prevent **different customers** from making reservations for the same time slot.

Dates are stored in ISO Gregorian format and displayed using Persian date formatting.

## Technical Decisions

1. **Separating business logic from the UI:** Validation, data selection/sorting, and status changes are implemented in `src/domain/` so they can be tested without rendering React.
2. **State management with Context and hooks:** Built-in React features are used instead of adding a state management library, keeping the project lightweight and easy to understand.
3. **Storage with `localStorage`:** This allows the demo to run without a server. Data is stored under the `nobat.reservations.v1` key. When data is loaded, record structure and ID uniqueness are validated. If the data is corrupted, an error message and a recovery option are provided.
4. **Input text normalization:** Differences between Persian and Arabic numerals and characters such as `ي/ی` and `ك/ک` are handled for searching and validation.
5. **CSV compatibility with Persian text:** Exported CSV files include a UTF-8 BOM, quoted fields, and neutralization of values that resemble spreadsheet formulas.
6. **Simple navigation and standalone CSS:** Navigation between pages is managed with internal React state; the current version does not require a router or CSS framework.

## Initial Data and Storage Behavior

On the first run, if no existing data is found under the application's storage key, **16 sample reservations** are created and saved in the browser. On subsequent runs, the browser's stored data is loaded. The "Restore Sample Data" option **deletes and replaces** all current reservations and changes in that browser.

Please note:

- Data is not synchronized across browsers, devices, or users.
- Clearing browser or site data may delete reservations.
- CSV export includes only reservations matching the current filters and **does not export notes**. The application also does not support CSV import. Therefore, a CSV export is not a complete, restorable backup of the data.
- If the browser does not allow writes to `localStorage`, changes may persist only until the page is closed, and the application displays a warning.

## Limitations and Future Development

This version has **no API, server, centralized database, user login, or access-control levels**. For production use with real customer data, it is recommended to add a backend and authentication, access control, backup and recovery, multi-user synchronization, appointment capacity rules, and personal data protection.

## Troubleshooting

- **The project won't start:** Check your Node.js version with `node -v`, then run `npm ci` in the directory containing `package.json`.
- **The page is blank or a different port is being used:** Check errors in the terminal and browser console, then open the exact URL printed by Vite.
- **Stored data is invalid:** Try the retry option first. If necessary, use "Restore Sample Data," keeping in mind that existing data will be replaced.
- **New reservations are not being saved:** Check whether the browser allows access to `localStorage` and has sufficient storage space.

---

> This README was prepared based on the project's existing structure and code. It does not claim the existence of a repository link, product screenshot, license, or backend service that was not present in the project files.
