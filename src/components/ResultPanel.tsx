import { Save, Edit3, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ResultPanelProps {
  open: boolean;
  onClose: () => void;
  data: any;
  onSave?: () => void;
}

export const ResultPanel = ({ open, onClose, data, onSave }: ResultPanelProps) => {
  if (!data) return null;

  const company = data.extracted?.company || {};
  const products = data.extracted?.products || [];

  console.log("Result Panel Data:", data);

  const handleSave = () => {
    if (onSave) {
      onSave();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl glass-panel border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            AI Quotation Result
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Company Information */}
          <Card className="card-gradient border-border lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg text-primary">Company Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Company Name</p>
                <p className="text-sm font-medium text-foreground">
                  {company.name || "NO DATA"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Contact Person</p>
                <p className="text-sm font-medium text-foreground">
                  {company.contact_person || "NO DATA"}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">City</p>
                  <p className="text-sm font-medium text-foreground">
                    {company.city || "NO DATA"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">State</p>
                  <p className="text-sm font-medium text-foreground">
                    {company.state || "NO DATA"}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="text-sm font-medium text-foreground">
                  {company.phone || "NO DATA"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium text-foreground break-all">
                  {company.email || "NO_DATA@NO.DATA"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Website</p>
                <p className="text-sm font-medium text-foreground">
                  {company.website || "NO DATA"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Address</p>
                <p className="text-sm font-medium text-foreground">
                  {company.street || "NO DATA"}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Order Date</p>
                  <p className="text-sm font-medium text-foreground">
                    {company.Order_date || "NO DATA"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Shipping Date</p>
                  <p className="text-sm font-medium text-foreground">
                    {company.Shipping_date || "NO DATA"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Products Table */}
          <Card className="card-gradient border-border lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg text-primary">
                Detected Products from Inquiry
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border hover:bg-transparent">
                        <TableHead className="text-muted-foreground">Internal Ref</TableHead>
                        <TableHead className="text-muted-foreground">Product Desc</TableHead>
                        <TableHead className="text-muted-foreground">Grade</TableHead>
                        <TableHead className="text-muted-foreground">Shape</TableHead>
                        <TableHead className="text-muted-foreground">Specs</TableHead>
                        <TableHead className="text-muted-foreground">Qty</TableHead>
                        <TableHead className="text-muted-foreground">Unit</TableHead>
                        <TableHead className="text-muted-foreground">Weight/sqft</TableHead>
                        <TableHead className="text-muted-foreground">Cost</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product: any, index: number) => (
                        <TableRow
                          key={index}
                          className="border-border hover:bg-muted/20 transition-colors"
                        >
                          <TableCell className="font-mono text-xs text-foreground">
                            {product.internal_ref || "—"}
                          </TableCell>
                          <TableCell className="text-sm text-foreground">
                            {product.product_desc || "—"}
                          </TableCell>
                          <TableCell className="text-sm text-foreground">
                            {product.grade || "—"}
                          </TableCell>
                          <TableCell className="text-sm text-foreground">
                            {product.shape || "—"}
                          </TableCell>
                          <TableCell className="text-sm text-foreground max-w-[200px] truncate">
                            {product.specs || "—"}
                          </TableCell>
                          <TableCell className="text-sm text-foreground">
                            {product.quantity || "—"}
                          </TableCell>
                          <TableCell className="text-sm text-foreground">
                            {product.unit || "—"}
                          </TableCell>
                          <TableCell className="text-sm text-foreground">
                            {product.weight_per_sqft || "—"}
                          </TableCell>
                          <TableCell className="text-sm text-foreground">
                            {product.cost || "0"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-foreground">
                  ✅ <span className="font-medium">{products.length}</span> products
                  extracted successfully
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 hover:border-primary/50"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit Manually
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleSave}
                    className="gap-2 bg-primary hover:bg-primary/90 glow-blue"
                  >
                    <Save className="w-4 h-4" />
                    Save Quotation
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={onClose}
                    className="gap-2"
                  >
                    <X className="w-4 h-4" />
                    Discard
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
