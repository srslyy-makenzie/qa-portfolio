import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

type Row = { area: string; layer: string; decision: string; why: string }

/** The "what I automated, at which layer, and why" table every strategy section needs. */
export function Decisions({ caption, rows }: { caption: string; rows: Row[] }) {
  return (
    <div className="my-6">
      <Table data-testid="decisions-table">
        <TableCaption>{caption}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Area</TableHead>
            <TableHead>Layer</TableHead>
            <TableHead>Decision</TableHead>
            <TableHead>Why</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.area}>
              <TableHead scope="row" className="min-w-40 py-2 whitespace-normal text-foreground">
                {r.area}
              </TableHead>
              <TableCell>
                <Badge variant="outline">{r.layer}</Badge>
              </TableCell>
              <TableCell className="whitespace-nowrap">{r.decision}</TableCell>
              <TableCell className="min-w-64 text-muted-foreground">{r.why}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
