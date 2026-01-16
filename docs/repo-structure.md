```
leave-planner/
├── README.md
├── docker-compose.yml
├── .gitignore
├── .editorconfig
├── .env.example
│
├── apps/
│   ├── web/                    # SvelteKit frontend
│   │
│   └── api/                    # FastAPI backend (uv package manager)
│
│
├── solver/                     # Optimization core (isolated)
│   ├── model/
│   │   ├── variables.py
│   │   ├── constraints.py
│   │   ├── objective.py
│   │   └── builder.py
│   ├── engine/
│   │   ├── cp_sat.py
│   │   └── results.py
│   ├── fixtures/
│   │   └── sample_inputs.json
│   ├── tests/
│   ├── README.md
│   └── pyproject.toml
│
├── packages/                   # Shared contracts & constants
│   ├── schemas/
│   │   ├── openapi.yaml
│   │   └── types.ts
│   └── constants/
│       └── defaults.json
│
├── scripts/
│   ├── seed_holidays.py
│   ├── generate_types.sh
│   └── dev.sh
│
└── docs/                       # 📌 All design documentation

```
