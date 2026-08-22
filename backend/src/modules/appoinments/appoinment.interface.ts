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

interface IBookAppointmentPayload {
    doctorId: string;
    scheduleId: string;
}


export { ICreateAppoinmentPayload, IUpdateAppoinmentPayload,IBookAppointmentPayload };