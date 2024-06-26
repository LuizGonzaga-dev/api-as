import { RequestHandler } from "express";
import * as events from "../services/events";
import { z } from "zod";

export const getAll: RequestHandler = async (req, res) => {
    
    const itens = await events.getAll();

    if(itens)
        return res.json({events: itens});

    res.json({error: "Ocorreu um erro"});

}

export const getEvent: RequestHandler = async (req, res) => {

    const { id } = req.params;

    const event = await events.getEvent(parseInt(id));

    if(event)
        return res.json({event: event});

    res.json({error: "Ocorreu um erro"})
}

export const addEvent: RequestHandler = async (req, res) => {

    const addEventSchema = z.object({
        title: z.string(),
        description: z.string(),
        grouped: z.boolean()
    });

    const body = addEventSchema.safeParse(req.body);

    if(!body.success)
        return res.json({error: "Dados inválidos"});

    const newEvent = await events.add(body.data);

    if(newEvent)
        return res.status(201).json({event: newEvent});

    res.json({error: "Ocorreu um erro"});
}

export const updateEvent: RequestHandler = async (req, res) => {
    const {id} = req.params;

    const updateEventSchema = z.object({
        status: z.boolean().optional(),
        title: z.string().optional(),
        description: z.string().optional(),
        grouped: z.boolean().optional()
    });

    const body = updateEventSchema.safeParse(req.body);

    if(!body.success)
        return res.json({error: 'Dados inválidos!'});

    const updatedEvent = await events.update(parseInt(id), body.data);

    if(updatedEvent){

        if(updatedEvent.status){
            //TODO: fazer o sorteio
        }else{
            //TODO: Limpar o sorteio
        }

        return res.json( { event: updatedEvent } )
    }

    res.json({error: "Ocorreu um erro"});
} 

export const deleteEvent: RequestHandler = async (req, res) => {

    const {id} = req.params;

    const deleted = await events.remove(parseInt(id));

    if(!deleted)
        return res.json({error: "Ocorreu um erro"});

    res.status(200).json({event:deleted});
}