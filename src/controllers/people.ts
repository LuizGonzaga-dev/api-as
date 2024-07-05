import { RequestHandler } from "express";
import * as people from "../services/people";
import { z } from "zod";
import { decryptMatch } from "../utils/match";

export const getAll: RequestHandler = async (req, res) => {
    const {id_event, id_group} = req.params;

    const itens = await people.getAll({
        id_event: parseInt(id_event),
        id_group: parseInt(id_group)
    });

    if(itens)
        return res.json({people:itens});

    res.json({error: "Ocorreu um erro"});
}

export const getPerson: RequestHandler = async (req, res) => {
    const {id, id_event, id_group} = req.params;

    const person = await people.getOne(
        {
            id: parseInt(id),
            id_event: parseInt(id_event),
            id_group: parseInt(id_group)
        }
    );

    if(person)
        return res.json({person});

    return res.json({error: "Ocorreu um erro!"})
}


export const addPerson: RequestHandler = async (req, res) => {
    const {id_event, id_group} = req.params;

    const addPersonSchema = z.object({
        name:z.string(),
        cpf: z.string().transform(val => val.replace(/\.|-/gm, ''))
    })

    const body = addPersonSchema.safeParse(req.body);
    if(!body.success)
        return res.json({error:"Dados inválidos!"});

    const newPerson = await people.add(
        {
            ...body.data,
            id_event: parseInt(id_event),
            id_group: parseInt(id_group)
        }
    )

    if(newPerson)
        return res.status(201).json({person: newPerson});

    return res.json({error: "Ocorreu um erro!"});
}

export const updatePerson: RequestHandler = async (req, res) => {
    const {id, id_event, id_group} = req.params;

    const updatePersonSchema = z.object({
        name: z.string().optional(),
        cpf: z.string().transform(val => val.replace(/\.|-/gm, '')).optional(),
        matched: z.string().optional()
    });

    const body = updatePersonSchema.safeParse(req.body);

    if(!body.success)
        return res.json({error: "Dados inválidos!"});

    const updatedPerson = await people.update(
        {
            id: parseInt(id),
            id_event: parseInt(id_event),
            id_group: parseInt(id_group)
        },
        body.data
    )

    if(updatedPerson){
        const p = await people.getOne(
            {
                id: parseInt(id),
                id_event: parseInt(id_event),
                id_group: parseInt(id_group)
            }
        );

        return res.json({person: p})
    }
        return res.json({person: updatedPerson});

    return res.json({error: "Ocorreu um erro!"});

} 


export const deletePerson: RequestHandler = async (req, res) => {
    const {id, id_event, id_group} = req.params;

    const deletedPersoon = await people.remove(
        {
            id: parseInt(id),
            id_event: parseInt(id_event),
            id_group: parseInt(id_group)
        }
    );

    if(deletedPersoon)
        return res.json({person: deletedPersoon});

    return res.json({error: "Ocorreu um erro!"});
}

export const searchPerson: RequestHandler = async (req, res) => {
    const {id_event} = req.params;

    const searchPersonSchema = z.object({
        cpf: z.string().transform(val => val.replace(/\.|-/gm, ''))
    });

    const query = searchPersonSchema.safeParse(req.query);

    if(!query.success)
        return res.json({error: "Dados inválidos!"});

    const personItem = await people.getOne(
        {
            id_event: parseInt(id_event),
            cpf: query.data.cpf
        }
    );

    if(personItem && personItem.matched) {
        const matchId = decryptMatch(personItem.matched);

        const personMatched = await people.getOne(
            {
                id_event: parseInt(id_event),
                id: matchId
            }
        );

        if(personMatched){
            return res.json(
                {
                    person:{
                        id: personItem.id,
                        name: personItem.name
                    },
                    personMatched:{
                        id: personMatched.id,
                        name: personMatched.name
                    }
                }
            )
        }
    }

    res.json({error: "Ocorreu um erro!"});
}












