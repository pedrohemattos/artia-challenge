import { Request, Response } from "express";
import { ActivityRepositoryDatabase } from "../repository/ActivityRepository"
import { CreateActivity } from "../../usecase/CreateActivity"
import { DateRangeError } from "../../error/DateRangeError";
import { NotFoundError } from "../../error/NotFoundError";
import { GetActivityById } from "../../usecase/GetActivityById";

export class ActivityController {

  async get(request: Request, response: Response) {
    try {
      const activityRepository = new ActivityRepositoryDatabase()
      const getActivityById = new GetActivityById(activityRepository)
      const { id } = request.params
      const output = await getActivityById.execute({ activityId: id })
      return response.status(200).send({ 
        message: "Activity successfully retrieved",
        value: output
      })
    } catch (error) {
      if(error instanceof NotFoundError) return response.status(404).send({ message: error.message })
      return response.status(500).send({
        message: 'Error while getting activity by id',
        error
      })
    }
  }

  async create(request: Request, response: Response) {
    try {
      const activityRepository = new ActivityRepositoryDatabase()
      const createActivity = new CreateActivity(activityRepository)
      const input = request.body
      const output = await createActivity.execute(input)
      return response.status(201).send({ 
        message: "Activity successfully created",
        value: output
      })
    } catch (error) {
      if(error instanceof DateRangeError) return response.status(400).send({ message: error.message })
      return response.status(500).send({
        message: 'Error while creating activity',
        error
      })
    }
  }
}