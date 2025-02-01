import {opendiscord, api, utilities} from "../../index"

export const loadAllRoles = async () => {
    await opendiscord.options.loopAll((opt) => {
        if (opt instanceof api.ODRoleOption){
            opendiscord.roles.add(loadRole(opt))
        }
    })
}

export const loadRole = (option:api.ODRoleOption) => {
    return new api.ODRole(option.id,[
        new api.ODRoleData("openticket:roles",option.get("openticket:roles").value),
        new api.ODRoleData("openticket:mode",option.get("openticket:mode").value),
        new api.ODRoleData("openticket:remove-roles-on-add",option.get("openticket:remove-roles-on-add").value),
        new api.ODRoleData("openticket:add-on-join",option.get("openticket:add-on-join").value)
    ])
}