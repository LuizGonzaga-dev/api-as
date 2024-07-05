import { RequestHandler } from "express";
import * as groups from "../services/groups";
import { z } from "zod";
import { error } from "console";

export const getAll: RequestHandler = async (req, res) => {

    const {id_event} = req.params;

    const itens = await groups.getAll(parseInt(id_event)); 

    if(!itens)
        return res.json({error: "Ocorreu um erro!"});

    return res.json({groups: itens});
}

export const getGroup: RequestHandler = async (req, res) => {

    const {id, id_event} = req.params;

    const item = await groups.getGroup(parseInt(id), parseInt(id_event) );

    if(!item)
        return res.json({error: "Ocorreu um erro!"});

    return res.json({group:item});
}

export const addGroup: RequestHandler = async (req, res) => {
    const {id_event} = req.params;

    const addGroupSchema = z.object({
        name: z.string()
    });
    const body = addGroupSchema.safeParse(req.body);

    if(!body.success)
        return res.json({error:"Dados inválidos!"});

    const newGroup = await groups.add({
        ...body.data,
        id_event: parseInt(id_event)
    });

    if(newGroup)
        return res.status(201).json({ group: newGroup });

    res.json( { error: 'Ocorreu um errro!'} );
}

export const updateGroup: RequestHandler = async (req, res) => {
    const {id_event, id} = req.params;

    const updateGroupSchema = z.object({
        name: z.string().optional()
    });

    const body = updateGroupSchema.safeParse(req.body);

    if(!body.success)
        return res.json({error: "Dados inválidos!"});

    const updatedGroup = await groups.update(
        {
            id: parseInt(id),
            id_event:parseInt(id_event)
        },
        body.data
    );

    if(updatedGroup)
        return res.json({group: updatedGroup});

    res.json({error: "Ocorreu um erro!"});
}

export const deleteGroup: RequestHandler = async (req, res) => {
    const {id, id_event} = req.params;

    const deleted = await groups.remove({
        id: parseInt(id),
        id_event: parseInt(id_event)
    })

    if(deleted)
        return res.json({event: deleted});

    return res.json({error: "Ocorreu um erro!"});
}

















