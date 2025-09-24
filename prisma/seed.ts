import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const main = async () => {
    console.log("Starting seed...");
    await prisma.servicesType.deleteMany({});
    console.log("Deleted all services types.");
    await prisma.servicesType.createMany({
        data: [
            { serviceName: "Ligação de água", serviceCode: "ST1" },
            { serviceName: "Ligação de esgoto", serviceCode: "ST2" },
            { serviceName: "Vazamento de água", serviceCode: "ST3" },
            { serviceName: "Vazamento de esgoto", serviceCode: "ST4" },
            { serviceName: "Entupimento", serviceCode: "ST5" },
            { serviceName: "Retirada de entulho", serviceCode: "ST6" },
            { serviceName: "Outros", serviceCode: "ST7" }
        ],
    });
    console.log("Seed completed successfully.");
};

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });