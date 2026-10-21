import * as mc from "@minecraft/server";
import * as forms from "./forms.js";

console.warn("§2Script Carregado");

const WARNINGTXT = {message: "ec.ancient_catalyst.notEnoughXP"}
const DISPLAY_ID = "ec:item_display";
const ACCEPTED_ITEM = "minecraft:lapis_lazuli";
const ITEM_PROPERTY = "ec:item";
const ENRICHED_ITEM = "ec:enriched_lapis";



function getDisplay(block) {
    return block.dimension.getEntities({
        type: DISPLAY_ID,
        location: block.center(),
        maxDistance:1
    })[0];
};

function removeDisplay(display, dimension, location) {
    const itemId = display.getDynamicProperty(ITEM_PROPERTY);
    if (itemId) dimension.spawnItem(new mc.ItemStack(itemId, 1), location);
    display.remove()
};

function enrich(player, display) {
    const EXPCOST = forms.XP_COST

    if (player.level < EXPCOST) {
        player.onScreenDisplay.setActionBar({translate: WARNINGTXT.message});
        return;
    }

    
    player.addLevels(-EXPCOST);
    setDisplayItem(display, ENRICHED_ITEM)
    player.sendMessage("§aLapis enriched")

}

function setDisplayItem(display, itemId) {
    display.runcCommand(`replaceitem entity @s slot.weapon.mainhand 0 ${itemId}`);
    display.setDynamicProperty(ITEM_PROPERTY, itemId);
}

function giveToPlayer(player, itemId) {
    const inventory = player.getComponent("minecraft:inventory").container;
    const leftover = inventory.addItem(new mc.itemStack(itemId, 1));

    if (leftover) player.dimension.spawnItem(leftover, player.location);
}


mc.system.beforeEvents.startup.subscribe(({blockComponentRegistry}) => {
    blockComponentRegistry.registerCustomComponent("ec:catalyst", {
        onPlayerInteract({block, dimension, player}) {
            if(!player) return;

            const display = getDisplay(block);
            const playerEquip = player.getComponent("minecraft:equippable");
            const held = playerEquip.getEquipment(mc.EquipmentSlot.Mainhand);
           
            
            if(display) {
                const storedId = display.getDynamicProperty(ITEM_PROPERTY);


                if(storedId === ENRICHED_ITEM || player.isSneaking) {
                    giveToPlayer(player, storedId);
                    display.remove();
                    return;
                }


                if(held) return;

                forms.showCatalystForm(player).then((response) => {
                    if(response.canceled) return;
                    if(!display.isValid) return;
                    if(response.selection === 0) {
                        enrich(player, display);


                    };
                    
                })
                
                
                return;
            }
            
            if(held?.typeId !== ACCEPTED_ITEM) return;

            const location = block.center();
            location.y += 0.6;
            const entity = dimension.spawnEntity(DISPLAY_ID, location);
            entity.runCommand(`replaceitem entity @s slot.weapon.mainhand 0 ${ACCEPTED_ITEM}`);
            entity.setDynamicProperty(ITEM_PROPERTY, ACCEPTED_ITEM);
            
         

            if (player.getGameMode() !== mc.GameMode.Creative) {
                if (held.amount > 1) {
                    held.amount--;
                    playerEquip.setEquipment(mc.EquipmentSlot.Mainhand, held);

                } else {
                    playerEquip.setEquipment(mc.EquipmentSlot.Mainhand, undefined);

                }
            }


        },

        onPlayerBreak({block, dimension}) {
            const display = getDisplay(block);
            if(!display) return;
            removeDisplay(display, dimension, block.center());
        }
    })
})