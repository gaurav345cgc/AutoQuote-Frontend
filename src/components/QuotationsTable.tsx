import { useState } from "react";
import { Search, Eye, ChevronDown, ChevronRight, Edit3, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { deleteQuotation, updateQuotation, fetchQuotationById, SavedQuotation } from "@/services/api";

interface QuotationsTableProps {
  quotations?: SavedQuotation[];
  isLoading?: boolean;
  onQuotationUpdate?: () => void;
}

interface Product {
  internal_ref?: string;
  product_desc?: string;
  name?: string;
  grade?: string;
  shape?: string;
  specs?: string;
  size?: string;
  quantity?: string | number;
  unit?: string;
  weight_per_sqft?: string;
  cost?: string | number;
  variant_type?: string;
}

export const QuotationsTable = ({ quotations = [], isLoading = false, onQuotationUpdate }: QuotationsTableProps) => {
  const [search, setSearch] = useState("");
  const [expandedQuotations, setExpandedQuotations] = useState<Set<string>>(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState<SavedQuotation | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<{ product: Product; index: number } | null>(null);
  const [editedProduct, setEditedProduct] = useState<Product | null>(null);

  const filteredQuotations = quotations.filter((quotation) => {
    const searchLower = search.toLowerCase();
    return (
      "steel inc.".includes(searchLower) ||
      "orders@steelinc.com".includes(searchLower) ||
      quotation._id.toLowerCase().includes(searchLower) ||
      quotation.products?.some(p => 
        p.product_desc?.toLowerCase().includes(searchLower) ||
        p.grade?.toLowerCase().includes(searchLower)
      )
    );
  });

  const toggleExpand = (quotationId: string) => {
    const newExpanded = new Set(expandedQuotations);
    if (newExpanded.has(quotationId)) {
      newExpanded.delete(quotationId);
    } else {
      newExpanded.add(quotationId);
    }
    setExpandedQuotations(newExpanded);
  };

  const handleDeleteQuotation = (quotation: SavedQuotation) => {
    setSelectedQuotation(quotation);
    setDeleteDialogOpen(true);
  };

  const handleEditProduct = (quotation: SavedQuotation, product: Product, index: number) => {
    setSelectedQuotation(quotation);
    setSelectedProduct({ product, index });
    setEditedProduct({ ...product });
    setEditDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedQuotation) return;
    
    try {
      await deleteQuotation(selectedQuotation._id);
      toast.success("Quotation deleted successfully!");
      setDeleteDialogOpen(false);
      setSelectedQuotation(null);
      
      if (onQuotationUpdate) {
        onQuotationUpdate();
      }
    } catch (error) {
      console.error("Failed to delete quotation:", error);
      toast.error("Failed to delete quotation. Please try again.");
    }
  };

  const saveEdit = async () => {
    if (!editedProduct || !selectedQuotation || !selectedProduct) return;
    
    try {
      const fullQuotation = await fetchQuotationById(selectedQuotation._id);
      const updatedProducts = [...fullQuotation.products];
      updatedProducts[selectedProduct.index] = editedProduct;
      
      await updateQuotation(selectedQuotation._id, {
        products: updatedProducts
      });
      
      toast.success("Product updated successfully!");
      setEditDialogOpen(false);
      setSelectedQuotation(null);
      setSelectedProduct(null);
      setEditedProduct(null);
      
      if (onQuotationUpdate) {
        onQuotationUpdate();
      }
    } catch (error) {
      console.error("Failed to update product:", error);
      toast.error("Failed to update product. Please try again.");
    }
  };

  const handleInputChange = (field: keyof Product, value: string) => {
    if (!editedProduct) return;
    setEditedProduct({
      ...editedProduct,
      [field]: value
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">
          Quotations
          {quotations.length > 0 && (
            <span className="ml-2 text-sm text-muted-foreground">
              ({quotations.length} {quotations.length === 1 ? "quotation" : "quotations"})
            </span>
          )}
        </h2>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search quotations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-input border-border"
          />
        </div>
      </div>

      <div className="card-gradient rounded-2xl border border-border shadow-lg overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 animate-pulse">
              <Search className="w-8 h-8 text-primary animate-spin" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Loading Quotations...
            </h3>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Fetching quotations from database
            </p>
          </div>
        ) : filteredQuotations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No Quotations Found
            </h3>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Use the "Create with AI" button to generate quotations from customer emails
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="w-10"></TableHead>
                  <TableHead className="text-muted-foreground font-medium">Quote ID</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Date</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Company</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Products</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Status</TableHead>
                  <TableHead className="text-muted-foreground font-medium text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuotations.map((quotation, qIndex) => {
                  const isExpanded = expandedQuotations.has(quotation._id);
                  const productCount = quotation.products?.length || 0;
                  
                  return (
                    <>
                      {/* Quotation Row */}
                      <TableRow
                        key={quotation._id}
                        className="border-border hover:bg-muted/30 transition-colors cursor-pointer"
                      >
                        <TableCell onClick={() => toggleExpand(quotation._id)}>
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                          )}
                        </TableCell>
                        <TableCell onClick={() => toggleExpand(quotation._id)} className="font-mono text-xs text-foreground">
                          Quote #{qIndex + 1}
                        </TableCell>
                        <TableCell onClick={() => toggleExpand(quotation._id)} className="text-sm text-foreground">
                          {formatDate(quotation.createdAt)}
                        </TableCell>
                        <TableCell onClick={() => toggleExpand(quotation._id)} className="text-sm text-foreground">
                          <div>
                            <div className="font-medium">STEEL INC.</div>
                            <div className="text-xs text-muted-foreground">orders@steelinc.com</div>
                          </div>
                        </TableCell>
                        <TableCell onClick={() => toggleExpand(quotation._id)} className="text-sm text-foreground">
                          <Badge variant="outline" className="border-primary/30 text-primary">
                            {productCount} {productCount === 1 ? "Product" : "Products"}
                          </Badge>
                        </TableCell>
                        <TableCell onClick={() => toggleExpand(quotation._id)} className="text-sm text-foreground">
                          <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
                            {quotation.status || "Success"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleExpand(quotation._id)}
                              className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                              title="View products"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteQuotation(quotation)}
                              className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                              title="Delete quotation"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>

                      {/* Expanded Products View */}
                      {isExpanded && (
                        <TableRow key={`${quotation._id}-products`} className="border-border bg-muted/20">
                          <TableCell colSpan={7} className="p-0">
                            <div className="p-6 space-y-4">
                              <h4 className="text-sm font-semibold text-foreground mb-4">Products in this Quotation:</h4>
                              <div className="rounded-lg border border-border overflow-hidden">
                                <Table>
                                  <TableHeader>
                                    <TableRow className="bg-background/50">
                                      <TableHead className="text-xs">Ref</TableHead>
                                      <TableHead className="text-xs">Description</TableHead>
                                      <TableHead className="text-xs">Grade</TableHead>
                                      <TableHead className="text-xs">Shape</TableHead>
                                      <TableHead className="text-xs">Specs</TableHead>
                                      <TableHead className="text-xs">Qty</TableHead>
                                      <TableHead className="text-xs">Unit</TableHead>
                                      <TableHead className="text-xs">Weight/sqft</TableHead>
                                      <TableHead className="text-xs">Cost</TableHead>
                                      <TableHead className="text-xs text-right">Actions</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {quotation.products && quotation.products.map((product, pIndex) => (
                                      <TableRow key={pIndex} className="hover:bg-muted/30">
                                        <TableCell className="text-xs font-mono">{product.internal_ref || "—"}</TableCell>
                                        <TableCell className="text-xs">{product.product_desc || "—"}</TableCell>
                                        <TableCell className="text-xs">{product.grade || "—"}</TableCell>
                                        <TableCell className="text-xs">{product.shape || "—"}</TableCell>
                                        <TableCell className="text-xs max-w-[200px] truncate">{product.specs || "—"}</TableCell>
                                        <TableCell className="text-xs">{product.quantity || "—"}</TableCell>
                                        <TableCell className="text-xs">{product.unit || "—"}</TableCell>
                                        <TableCell className="text-xs">{product.weight_per_sqft || "—"}</TableCell>
                                        <TableCell className="text-xs font-semibold">
                                          ${typeof product.cost === 'number' ? product.cost.toFixed(2) : product.cost || "0.00"}
                                        </TableCell>
                                        <TableCell className="text-right">
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleEditProduct(quotation, product, pIndex)}
                                            className="h-7 w-7 p-0 hover:bg-primary/10 hover:text-primary"
                                            title="Edit product"
                                          >
                                            <Edit3 className="h-3 w-3" />
                                          </Button>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="glass-panel border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Quotation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this quotation for <strong>STEEL INC.</strong>?
              <br />
              <br />
              This will delete all {selectedQuotation?.products?.length || 0} products in this quotation.
              <br />
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete Quotation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Product Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="glass-panel border-border max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Edit Product</DialogTitle>
          </DialogHeader>
          
          {editedProduct && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="internal_ref">Internal Ref</Label>
                  <Input
                    id="internal_ref"
                    value={editedProduct.internal_ref || ""}
                    onChange={(e) => handleInputChange("internal_ref", e.target.value)}
                    className="bg-input border-border"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="grade">Grade</Label>
                  <Input
                    id="grade"
                    value={editedProduct.grade || ""}
                    onChange={(e) => handleInputChange("grade", e.target.value)}
                    className="bg-input border-border"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="product_desc">Product Description</Label>
                <Input
                  id="product_desc"
                  value={editedProduct.product_desc || ""}
                  onChange={(e) => handleInputChange("product_desc", e.target.value)}
                  className="bg-input border-border"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shape">Shape</Label>
                  <Input
                    id="shape"
                    value={editedProduct.shape || ""}
                    onChange={(e) => handleInputChange("shape", e.target.value)}
                    className="bg-input border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Input
                    id="unit"
                    value={editedProduct.unit || ""}
                    onChange={(e) => handleInputChange("unit", e.target.value)}
                    className="bg-input border-border"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="specs">Specifications</Label>
                <Input
                  id="specs"
                  value={editedProduct.specs || ""}
                  onChange={(e) => handleInputChange("specs", e.target.value)}
                  className="bg-input border-border"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    value={editedProduct.quantity?.toString() || ""}
                    onChange={(e) => handleInputChange("quantity", e.target.value)}
                    className="bg-input border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight_per_sqft">Weight/sqft</Label>
                  <Input
                    id="weight_per_sqft"
                    value={editedProduct.weight_per_sqft || ""}
                    onChange={(e) => handleInputChange("weight_per_sqft", e.target.value)}
                    className="bg-input border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cost">Cost ($)</Label>
                  <Input
                    id="cost"
                    value={editedProduct.cost?.toString() || ""}
                    onChange={(e) => handleInputChange("cost", e.target.value)}
                    className="bg-input border-border"
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              className="hover:border-primary/50"
            >
              Cancel
            </Button>
            <Button
              onClick={saveEdit}
              className="bg-primary hover:bg-primary/90 glow-blue"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
