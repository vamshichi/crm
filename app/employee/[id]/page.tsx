import {prisma } from '@/app/lib/prisma';
import { notFound } from 'next/navigation';
import EmployeeDashboard from '@/app/components/employee/EmployeeDashboard';

export default async function EmployeePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!id) return notFound();

  const employee = await prisma.employee.findUnique({
    where: { id },
    include: { department: true },
  });

  if (!employee) return notFound();

  return <EmployeeDashboard employee={employee} />;
}