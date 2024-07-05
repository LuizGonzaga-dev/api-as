import { PrismaClient, Prisma } from "@prisma/client";
import * as events from "./events";

const prisma = new PrismaClient();

export const getAll = async (id:number) => {

    try{
        const groups = await prisma.eventGroup.findMany({
            where:{
                id_event:id
            }
        })

        return groups;

    }catch(error){
        return false;
    }
}

export const getGroup = async (id: number, id_event?: number) => {

    try{
        return prisma.eventGroup.findFirst({
            where: {
                id,
                id_event
            }
        })
    }catch(error){
        return false;
    }
}

type GroupsCreateData = Prisma.Args<typeof prisma.eventGroup, 'create'>['data'];
export const add = async (data: GroupsCreateData) => {
     try{

        if(!data.id_event)
            return false;

        const eventItem = await events.getEvent(data.id_event);

        if(!eventItem)
            return false;

        return await prisma.eventGroup.create({data});

     }catch(error){
        return false;
     }
}


type UpdateFilters = {id: number, id_event?: number}
type GroupsUpdateData = Prisma.Args<typeof prisma.eventGroup, 'update'>['data'];
export const update = async (filters: UpdateFilters, data: GroupsUpdateData) => {
    try{
        return await prisma.eventGroup.update({
            where:filters,
            data
        });
    }catch(error){
        return false;
    }
}

type DeleteFilters = {id: number, id_event: number}
export const remove = async (filters: DeleteFilters) => {
    try{
        return await prisma.eventGroup.delete({where: filters})
    }catch(error){
        return false;
    }
}









