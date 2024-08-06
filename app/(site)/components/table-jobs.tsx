import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import React from "react";
interface TableJobsProps {
  jobs: any;
}

const TableJobs: React.FC<TableJobsProps> = ({ jobs }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Job</TableHead>
          <TableHead>Workplace</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {jobs.map((job: any, index: number) => (
          <TableRow key={index}>
            <TableCell>{job.job}</TableCell>
            <TableCell>{job.workplace}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TableJobs;
