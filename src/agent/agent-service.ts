import { ValidationError } from "../domain/errors.js";
import type { Category } from "../domain/types/place.js";
import type { SearchService } from "../services/search-service.js";
import type { SearchHit } from "../services/search-types.js";
import { groupByCategory, rulesAnswer, SUGGESTIONS } from "./answer-builder.js";
import { loadCategoryHits, type AgentRepositories } from "./category-loader.js";
import { detectIntents, keywordsFromQuestion } from "./intents.js";
import type { LlmClient } from "./llm-client.js";
import { searchFallback, tryLlm } from "./retrieval.js";

export interface AgentGroup {
  slug: string;
  name: string;
  color: string;
  items: SearchHit[];
}

export interface AgentAnswer {
  question: string;
  answer: string;
  generatedBy: "rules" | "llm";
  intents: string[];
  groups: AgentGroup[];
  suggestions: string[];
}

/** Agente de consulta: recupera datos del dominio y redacta la respuesta. */
export class AgentService {
  constructor(
    private readonly repos: AgentRepositories,
    private readonly search: SearchService,
    private readonly llm: LlmClient | null,
  ) {}

  async ask(question: string): Promise<AgentAnswer> {
    const clean = question.trim();
    if (clean.length < 3) throw new ValidationError("La pregunta es demasiado corta");
    if (clean.length > 400) throw new ValidationError("La pregunta supera 400 caracteres");

    const categories = await this.repos.categories.list({ limit: 50, offset: 0 });
    const intents = detectIntents(clean);
    const groups = await this.collectGroups(intents, categories.items, clean);
    const fallback = rulesAnswer(clean, groups);
    const llmAnswer = await tryLlm(this.llm, clean, groups, fallback);

    return {
      question: clean,
      answer: llmAnswer ?? fallback,
      generatedBy: llmAnswer ? "llm" : "rules",
      intents,
      groups,
      suggestions: SUGGESTIONS.filter((item) => !clean.includes(item)).slice(0, 3),
    };
  }

  private async collectGroups(
    intents: string[],
    categories: Category[],
    question: string,
  ): Promise<AgentGroup[]> {
    if (intents.length === 0) {
      return groupByCategory(await this.searchFallback(question), categories);
    }

    const groups: AgentGroup[] = [];
    for (const slug of intents) {
      const category = categories.find((item) => item.slug === slug);
      if (!category) continue;
      groups.push({
        slug,
        name: category.name,
        color: category.color,
        items: await loadCategoryHits(this.repos, slug),
      });
    }
    return groups;
  }

  private searchFallback(question: string): Promise<SearchHit[]> {
    return searchFallback(this.search, keywordsFromQuestion(question));
  }
}
