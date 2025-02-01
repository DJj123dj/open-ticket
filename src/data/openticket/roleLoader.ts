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
        new api.ODRoleData("opendiscord:roles",option.get("opendiscord:roles").value),
        new api.ODRoleData("opendiscord:mode",option.get("opendiscord:mode").value),
        new api.ODRoleData("opendiscord:remove-roles-on-add",option.get("opendiscord:remove-roles-on-add").value),
        new api.ODRoleData("opendiscord:add-on-join",option.get("opendiscord:add-on-join").value)
    ])
}