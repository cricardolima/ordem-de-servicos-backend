import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const main = async () => {
    console.log("Starting seed...");
    await prisma.servicesType.deleteMany({});
    console.log("Deleted all services types.");
    await prisma.servicesType.createMany({
        data: [
            { serviceName: "Ligação de água", serviceCode: "SRV1" },
            { serviceName: "Ligação de esgoto", serviceCode: "SRV2" },
            { serviceName: "Vazamento de água", serviceCode: "SRV3" },
            { serviceName: "Vazamento de esgoto", serviceCode: "SRV4" },
            { serviceName: "Entupimento", serviceCode: "SRV5" },
            { serviceName: "Retirada de entulho", serviceCode: "SRV6" },
            { serviceName: "Outros", serviceCode: "SRV7" }
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