import { KeyWords, Priority } from "@prisma/client";

export const errorHandler = (body: KeyWords, method: "CREATE" | "UPDATE") => {

    //Checking for empty fields and wrong values

    if (method === "CREATE") {

        if (!body.priority) throw ({ message: `Empty "priority" field!` })

        if (!body.word) throw ({ message: `Empty "word" field!` })

        if (!body.active) throw ({ message: `Empty "active" field!` })

        if (body.priority && body.priority != Priority.CRITICAL && body.priority != Priority.HIGH && body.priority != Priority.LOW && body.priority != Priority.MEDIUM) throw ({ message: "Invalid PRIORITY type, PRIORITY cant be this type!" })

        if (body.active && body.active && body.active !== true && body.active !== false) throw ({ message: `Invalid "active" type, "active" cant be this type!` })

    }

    if (method === "UPDATE") {

        if (!body.id) throw ({ message: "No such ID exists in the database!" })

        if (isNaN(Number(body.id)) && typeof (body.id) != "number" && typeof body.id != typeof BigInt) throw ({ message: "Invalid ID type, ID cant be this type!" })

        if (body.priority && body.priority != Priority.CRITICAL && body.priority != Priority.HIGH && body.priority != Priority.LOW && body.priority != Priority.MEDIUM) throw ({ message: "Invalid PRIORITY type, PRIORITY cant be this type!" })

        if (body.active && body.active !== true && body.active !== false) throw ({ message: `Invalid "active" type, "active" cant be this type!` })

    }

    return null
}