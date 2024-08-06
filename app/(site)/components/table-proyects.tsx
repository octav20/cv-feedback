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
interface TableProyectsProps {
  proyects: any;
}

const TableProyects: React.FC<TableProyectsProps> = ({ proyects }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Name</TableHead>
          <TableHead>Description</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {proyects.map((proyect: any, index: number) => (
          <TableRow key={index}>
            <TableCell>{proyect.name}</TableCell>
            <TableCell>{proyect.description}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TableProyects;
