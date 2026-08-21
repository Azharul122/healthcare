interface ICreateAppoinmentPayload {
    doctorId: string;
    scheduleId: string;
    // status: string;
    // reason: string;
    // notes: string;
}

interface IUpdateAppoinmentPayload {
    // appoinmentId: string;
    doctorId: string;
    scheduleId: string;
    status: string;
    // reason: string;
    // notes: string;
}

export { ICreateAppoinmentPayload, IUpdateAppoinmentPayload };