import { prisma } from "./db";

export async function checkService(serviceId: string) {
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
  });

  if (!service) {
    throw new Error("Service not found");
  }

  const startTime = Date.now();

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(service.url, {
      method: "GET",
      signal: controller.signal,
      redirect: "follow",
    });

    clearTimeout(timeout);

    const latency = Date.now() - startTime;
    const isUp = response.status >= 200 && response.status < 300;

    const check = await prisma.check.create({
      data: {
        serviceId: service.id,
        status: isUp ? "up" : "down",
        statusCode: response.status,
        latency,
      },
    });

    return check;
  } catch {
    const latency = Date.now() - startTime;

    const check = await prisma.check.create({
      data: {
        serviceId: service.id,
        status: "down",
        statusCode: null,
        latency: latency >= 10000 ? null : latency,
      },
    });

    return check;
  }
}
