import * as MUi from "@minecraft/server-ui";

export const XP_COST = 5

export function showCatalystForm(player) {


        const form = new MUi.ActionFormData()
            .title("Ancient Catalyst")
            .body(`Click Start to enrich Lapis-Lazuli.\n§2This will cost you ${XP_COST} XP Levels`)
            .button("§aSTART")
            
            
        return form.show(player)
        
}