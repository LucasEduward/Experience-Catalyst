# Experience Catalyst

A Minecraft Bedrock addon that finds a way for the player to store experience and do some wild experiments.

## Structure

- `exp_catalyst_bp/` — behavior pack
- `exp_catalyst_rp/` — resource pack

## Development setup

The packs are linked into the game via directory junctions:

```powershell
$mojang = "$env:APPDATA\Minecraft Bedrock\Users\Shared\games\com.mojang"
New-Item -ItemType Junction -Path "$mojang\development_behavior_packs\exp_catalyst_bp" -Target "$PWD\exp_catalyst_bp"
New-Item -ItemType Junction -Path "$mojang\development_resource_packs\exp_catalyst_rp" -Target "$PWD\exp_catalyst_rp"
```
