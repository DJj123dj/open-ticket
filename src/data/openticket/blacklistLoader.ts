import { opendiscord, api, utilities } from "../../index.js"

export async function loadAllBlacklistedUsers() {
    const userDatabase = opendiscord.databases.get("opendiscord:users")
    if (!userDatabase) return

    const users = await userDatabase.getCategory("opendiscord:blacklist") ?? []
    users.forEach((user) => {
        if (typeof user.value === "string" || user.value === null) opendiscord.blacklist.add(new api.ODBlacklist(user.key, user.value))
    })
}