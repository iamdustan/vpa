## Requirements Update
- [ ] Support multiple job queries per employer (currently hardcoded or single-argument)

## Status
- [x] Package Initialization (@vpa/jobs)
- [x] CLI Implementation (`fetch` command)
- [x] Medtronic Fetcher (Workday)
    - [x] Basic fetching
    - [x] Normalization
    - [x] Strict title filtering
    - [x] Filter out senior, principal, and manager roles (Global)
- [x] Abbott Fetcher (Phenom People)
    - [x] Basic fetching (globalSearchEventV3)
    - [x] Normalization
    - [x] Strict title filtering
- [x] Boston Scientific Fetcher (Eightfold.ai)
    - [x] Basic fetching (/api/pcsx/search)
    - [x] Normalization
    - [x] Strict title filtering (includes "clinical representative")
- [x] Biotronik Fetcher (SuccessFactors)
    - [x] Basic fetching (Playwright)
    - [x] Normalization
    - [x] TDD implementation
    - [x] Filter out Thailand, Leadless, and Neuro roles

## Next Steps
1. Refactor to support a list of search queries per provider.
