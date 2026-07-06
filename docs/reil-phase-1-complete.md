# REIL Phase 1 Completion Criteria

Phase 1 is complete when all of the following are true:

- the underwriting doctrine is written and accepted
- the Phase 1 input schema is stable
- the Phase 1 scoring spec is stable
- the math engine computes core metrics and recommendations
- hard-fail conditions override score
- the red fail-state banner is wired into the engine output
- at least one passing fixture and one failing fixture are covered by automated tests

Current status:

- doctrine: complete
- schema: complete
- scoring spec: complete
- math engine: complete
- fail banner: complete
- automated fixtures/tests: complete

Phase 2 can begin now.

Recommended Phase 2 scope:

- create the app scaffold
- wire the underwriting engine into a basic UI
- build Quick Screen first
- expose score, fail reasons, and key metrics on screen
