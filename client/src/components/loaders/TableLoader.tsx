import { Skeleton } from "../ui/skeleton";
import { TableBody, TableCell, TableRow } from "../ui/table";

export default function TableLoader({ columnCount }: { columnCount: number }) {
  return (
    <TableBody>
      {[...Array(6)].map((_, i) => (
        <TableRow key={i}>
          {Array(columnCount)
            .fill(null)
            .map((_, index) => (
              <TableCell key={index}>
                <Skeleton className="h-10 w-full" />
              </TableCell>
            ))}
        </TableRow>
      ))}
    </TableBody>
  );
}
