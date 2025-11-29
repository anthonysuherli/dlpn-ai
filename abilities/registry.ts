import { Ability } from '@/types/ability';
import { formattingAbilities } from './formatting';
import { structureAbilities } from './structure';

class AbilityRegistry {
  private abilities: Map<string, Ability> = new Map();

  register(ability: Ability) {
    this.abilities.set(ability.id, ability);
  }

  get(id: string): Ability | undefined {
    return this.abilities.get(id);
  }

  getAll(): Ability[] {
    return Array.from(this.abilities.values());
  }

  getByCategory(category: string): Ability[] {
    return this.getAll().filter((a) => a.category === category);
  }
}

export const abilityRegistry = new AbilityRegistry();

formattingAbilities.forEach((a) => abilityRegistry.register(a));
structureAbilities.forEach((a) => abilityRegistry.register(a));

export function useAbilityRegistry() {
  return {
    getAbility: (id: string) => abilityRegistry.get(id),
    getAllAbilities: () => abilityRegistry.getAll(),
    getAbilitiesByCategory: (cat: string) => abilityRegistry.getByCategory(cat),
  };
}
