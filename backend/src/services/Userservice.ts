import { prisma } from "../config/prisma.js";

export class UserService {
    async getAllUsers() {
        return await prisma.user.findMany();
    }

    async createUser(name: string, email: string, age: number) {
        return await prisma.user.create({
            data: {
                name,
                email,
                age
            }
        });
    }
}
