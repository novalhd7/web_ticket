import prisma from "@/lib/prisma";

/* ===============================
   CAR
================================ */

// 🔹 tanpa relasi (admin table / ringan)
export async function getCar() {
  return prisma.car.findMany({
    orderBy: { createdAt: "desc" },
  });
}

// 🔹 dengan schedule (user booking / card)
export async function getCars() {
  return prisma.car.findMany({
    include: {
      schedules: {
        orderBy: { time: "asc" },
      },
    },
  });
}

/* ===============================
   BOOKING
================================ */

// 🔹 booking milik user (My Booking)
export async function getUserBookings(userId: string) {
  return prisma.booking.findMany({
    where: { userId },
    include: {
      schedule: {
        include: {
          car: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

// 🔹 semua booking (ADMIN)
export async function getAllBookings() {
  return prisma.booking.findMany({
    include: {
      user: true,
      schedule: {
        include: {
          car: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}
