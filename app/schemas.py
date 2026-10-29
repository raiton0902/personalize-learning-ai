from typing import Literal

from pydantic import BaseModel, Field, ConfigDict

OBJECTIVE_IDS = ("algebra.linear_equations", "algebra.substitution", "geometry.point_on_line")


class StrictModel(BaseModel):
    model_config = ConfigDict(extra="forbid")


class Objective(StrictModel):
    id: Literal["algebra.linear_equations", "algebra.substitution", "geometry.point_on_line"]
    title: str = Field(min_length=1, max_length=100)
    outcome: str = Field(min_length=1, max_length=350)
    prerequisites: list[str]
    source_ids: list[str] = Field(min_length=1)
    minutes: int = Field(ge=3, le=40)


class Curriculum(StrictModel):
    title: str = Field(min_length=1, max_length=120)
    scope_note: str = Field(max_length=500)
    objectives: list[Objective] = Field(min_length=1, max_length=3)


class ConceptItem(StrictModel):
    id: str = Field(min_length=1, max_length=80)
    title: str = Field(min_length=1, max_length=120)
    summary: str = Field(default="", max_length=300)
    required: bool = Field(default=True)


class CurriculumModule(StrictModel):
    id: str = Field(min_length=1, max_length=80)
    title: str = Field(min_length=1, max_length=120)
    summary: str = Field(default="", max_length=400)
    objective_ids: list[str] = Field(default_factory=list, max_length=24)


class GeneralObjective(StrictModel):
    id: str = Field(min_length=1, max_length=80)
    title: str = Field(min_length=1, max_length=120)
    outcome: str = Field(min_length=1, max_length=350)
    prerequisites: list[str]
    source_ids: list[str]
    minutes: int = Field(ge=3, le=90)
    module_id: str = Field(default="", max_length=80)
    module_title: str = Field(default="", max_length=120)
    source_sections: list[str] = Field(default_factory=list, max_length=12)
    concepts: list[ConceptItem] = Field(default_factory=list, max_length=8)
    prerequisite_bridge: str = Field(default="", max_length=300)
    optional_enrichment: str = Field(default="", max_length=300)
    assessment_required: bool = Field(default=True)
    review_opportunity: str = Field(default="", max_length=240)


class GeneralPlan(StrictModel):
    title: str = Field(min_length=1, max_length=120)
    scope_note: str = Field(max_length=500)
    intended_outcome: str = Field(default="", max_length=400)
    grounding_status: Literal["source_grounded", "partial_source", "unverified_general"] = Field(default="unverified_general")
    grounding_note: str = Field(default="", max_length=400)
    prerequisites: list[str] = Field(default_factory=list, max_length=12)
    prerequisite_bridges: list[str] = Field(default_factory=list, max_length=10)
    optional_enrichment: list[str] = Field(default_factory=list, max_length=10)
    review_opportunities: list[str] = Field(default_factory=list, max_length=10)
    modules: list[CurriculumModule] = Field(default_factory=list, max_length=12)
    objectives: list[GeneralObjective] = Field(min_length=1, max_length=24)


class Lesson(StrictModel):
    explanation: str = Field(min_length=1, max_length=1400)
    worked_example: list[str] = Field(min_length=2, max_length=5)


class Assessment(StrictModel):
    status: Literal["correct", "incorrect", "uncertain"]
    evidence: str = Field(max_length=700)
    possible_gap: str = Field(max_length=300)
    diagnostic_question: str = Field(min_length=1, max_length=600)
    flagged_line_index: int = Field(default=-1, ge=-1, le=50)
    flagged_start: int = Field(default=-1, ge=-1, le=1400)
    flagged_end: int = Field(default=-1, ge=-1, le=1400)
    flagged_quote: str = Field(default="", max_length=240)
    hint: str = Field(default="", max_length=400)


class Repair(StrictModel):
    explanation: str = Field(min_length=1, max_length=4000)
    observation: str = Field(max_length=350)
