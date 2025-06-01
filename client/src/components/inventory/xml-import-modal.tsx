import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, CloudUpload } from "lucide-react";

interface XMLImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function XMLImportModal({ open, onOpenChange }: XMLImportModalProps) {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "text/xml") {
      setFile(selectedFile);
    } else {
      alert("Por favor, selecione um arquivo XML válido.");
    }
  };

  const handleImport = () => {
    if (!file) {
      alert("Selecione um arquivo XML primeiro.");
      return;
    }
    
    // Mock import success
    alert("Arquivo XML importado com sucesso!");
    setFile(null);
    onOpenChange(false);
  };

  const handleClose = () => {
    setFile(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="text-center">
            <Upload className="text-accent mx-auto mb-4 h-12 w-12" />
            <DialogTitle className="text-2xl font-bold text-foreground">Importar XML</DialogTitle>
            <p className="text-muted-foreground mt-2">Faça upload do arquivo XML para importar produtos</p>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <CloudUpload className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
            <p className="text-muted-foreground mb-2">
              {file ? file.name : "Arraste o arquivo XML aqui ou"}
            </p>
            <label className="text-primary hover:text-primary/80 font-semibold cursor-pointer">
              clique para selecionar
              <input
                type="file"
                accept=".xml"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
          
          <div className="flex space-x-4">
            <Button onClick={handleClose} variant="outline" className="flex-1">
              Cancelar
            </Button>
            <Button onClick={handleImport} className="flex-1 cashbox-button-accent">
              Importar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
