export enum POLL_STATUS {
	Ready = 1, // รอคำตอบ
    Closed = 2, // คำนวณผล และปิดโพล์แล้ว
	Rejected = 3 // ไม่ใช้งานแล้ว
}

export const POLL_LIST_MAX = 10