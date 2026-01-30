import { Request, Response } from "express";
import { prisma } from "../../config/db";
import { nanoid } from "nanoid";

const APP_BASE_URL = process.env.PUBLIC_APP_URL || "http://localhost:3000";

export const enrollDoctor = async (req: Request, res: Response): Promise<void> => {
  const {
    doctorName,
    doctorEmail,
    doctorMobile,
    locationName,
    locationAddress,
    locationType,
    queueName,
    tokenPrefix,
  } = req.body as {
    doctorName?: string;
    doctorEmail?: string;
    doctorMobile?: string;
    locationName?: string;
    locationAddress?: string;
    locationType?: string;
    queueName?: string;
    tokenPrefix?: string;
  };

  if (!doctorName || !locationName || !locationAddress || !locationType || !queueName || !tokenPrefix) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }

  const publicId = `q_${nanoid(8)}`;

  const result = await prisma.$transaction(async (tx) => {
    const location = await tx.location.create({
      data: {
        name: locationName,
        address: locationAddress,
        type: locationType,
      },
    });

    const doctor = await tx.doctor.create({
      data: {
        name: doctorName,
        email: doctorEmail,
        mobile: doctorMobile,
      },
    });

    const queue = await tx.queue.create({
      data: {
        locationId: location.id,
        name: queueName,
        publicId,
        tokenPrefix,
        currentSequence: 0,
        status: "OPEN",
        doctorId: doctor.id,
      },
    });

    return { location, doctor, queue };
  });

  const qrUrl = `${APP_BASE_URL}/q/${result.queue.publicId}`;

  res.status(201).json({
    doctorId: result.doctor.id,
    queueId: result.queue.id,
    publicId: result.queue.publicId,
    qrUrl,
  });
};

export const getAllDoctors = async (req: Request, res: Response): Promise<void> => {
  try {
    const doctors = await prisma.doctor.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json({
      success: true,
      doctors,
    });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch doctors',
    });
  }
};
