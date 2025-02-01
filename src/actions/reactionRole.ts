///////////////////////////////////////
//REACTION ROLE SYSTEM
///////////////////////////////////////
import {opendiscord, api, utilities} from "../index"
import * as discord from "discord.js"

export const registerActions = async () => {
    opendiscord.actions.add(new api.ODAction("opendiscord:reaction-role"))
    opendiscord.actions.get("opendiscord:reaction-role").workers.add([
        new api.ODWorker("opendiscord:reaction-role",2,async (instance,params,source,cancel) => {
            const {guild,user,option,overwriteMode} = params
            const role = opendiscord.roles.get(option.id)
            if (!role) throw new api.ODSystemError("ODAction(ot:reaction-role) => Unknown reaction role (ODRole)")
            instance.role = role
            const mode = (overwriteMode) ? overwriteMode : role.get("opendiscord:mode").value
            
            await opendiscord.events.get("onRoleUpdate").emit([user,role])

            //get guild member
            const member = await opendiscord.client.fetchGuildMember(guild,user.id)
            if (!member) throw new api.ODSystemError("ODAction(ot:reaction-role) => User isn't a member of the server!")

            //get all roles
            const roleIds = role.get("opendiscord:roles").value
            const roles: discord.Role[] = []
            for (const id of roleIds){
                const r = await opendiscord.client.fetchGuildRole(guild,id)
                if (r) roles.push(r)
                else opendiscord.log("Unable to find role in server!","warning",[
                    {key:"roleid",value:id}
                ])
            }

            //update roles of user
            const result: api.ODRoleUpdateResult[] = []
            for (const r of roles){
                try{
                    if (r.members.has(user.id) && (mode == "add&remove" || mode == "remove")){
                        //user has role (remove)
                        await member.roles.remove(r)
                        result.push({role:r,action:"removed"})
                    }else if (!r.members.has(user.id) && (mode == "add&remove" || mode == "add")){
                        //user doesn't have role (add)
                        await member.roles.add(r)
                        result.push({role:r,action:"added"})
                    }else{
                        //don't do anything
                        result.push({role:r,action:null})
                    }
                }catch{
                    result.push({role:r,action:null})
                }
            }

            //get roles to remove on add
            if (result.find((r) => r.action == "added")){
                //get all remove roles
                const removeRoleIds = role.get("opendiscord:remove-roles-on-add").value
                const removeRoles: discord.Role[] = []
                for (const id of removeRoleIds){
                    const r = await opendiscord.client.fetchGuildRole(guild,id)
                    if (r) removeRoles.push(r)
                    else opendiscord.log("Unable to find role in server!","warning",[
                        {key:"roleid",value:id}
                    ])
                }

                //remove roles from user
                for (const r of removeRoles){
                    try{
                        if (r.members.has(user.id)){
                            //user has role (remove)
                            await member.roles.remove(r)
                            result.push({role:r,action:"removed"})
                        }
                    }catch{}
                }
            }

            //update instance & finish event
            instance.result = result
            await opendiscord.events.get("afterRolesUpdated").emit([user,role])
        }),
        new api.ODWorker("opendiscord:logs",0,(instance,params,source,cancel) => {
            const {guild,user,option} = params
            opendiscord.log(user.displayName+" updated his roles!","info",[
                {key:"user",value:user.username},
                {key:"userid",value:user.id,hidden:true},
                {key:"method",value:source},
                {key:"option",value:option.id.value}
            ])
        })
    ])
}