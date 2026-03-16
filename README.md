# shinyHuntSimulator
Pokemon gen1-5 shiny hunt simulator with accurate odds + animation to whenever you find a shiny
The project is built using vanilla HTML, CSS, and JavaScript, and integrates Pokémon sprites through the PokéAPI sprite repository.
--------------------------------------------------
Features

Encounter Simulation
- Manual encounters: Users can simulate an encounter by clicking a button.
- AFK mode: Encounters are automatically generated every 8 seconds.
Each encounter increments a counter until a shiny Pokémon appears.

Generation-Based Shiny Odds

Generation | Games | Odds
Gen 1 | FireRed / LeafGreen | 1 / 8192
Gen 2 | HeartGold / SoulSilver | 1 / 8192
Gen 3 | Ruby / Sapphire / Emerald | 1 / 8192
Gen 4 | Diamond / Pearl / Platinum | 1 / 8192
Gen 5 | Black / White | 1 / 4096

Gen 5 also supports the Shiny Charm:
1 / 1365

Multiple Active Hunts
Users can track multiple Pokémon hunts simultaneously.

Example:
Mew – 892 encounters
Rayquaza – 7200 encounters
Zekrom – 8273 encounters

Switching between hunts does not reset encounter progress.

Shiny Encounter Effects
When a shiny Pokémon appears:
- The encounter loop stops automatically
- The sprite switches to the shiny version
- A flash animation plays
- Sparkle particle effects appear around the sprite
- A shiny sound effect is triggered
