export class Tarea {
    constructor(
        public id: string,
        public title: string,
        public description: string,
        public status: string,
        public completed: boolean,
        public fecha: Date,
        public createdAt: Date,
        public updatedAt: Date,
    ){}
}