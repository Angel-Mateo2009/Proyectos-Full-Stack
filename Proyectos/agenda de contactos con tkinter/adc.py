import tkinter as tk
from tkinter import messagebox, ttk

class AgendaApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Agenda de Estudiantes - Escritorio")
        self.root.geometry("780x560")
        self.root.configure(bg="#1E293B")  # fondo elegante oscuro
        
        self.contactos = []
        
        self.var_nombre = tk.StringVar()
        self.var_telefono = tk.StringVar()
        self.var_email = tk.StringVar()
        self.var_categoria = tk.StringVar(value="General")
        self.var_busqueda = tk.StringVar()

        self.crear_interfaz()

    def crear_interfaz(self):

        # TITULO
        lbl_titulo = tk.Label(
            self.root,
            text="Gestión de Contactos",
            font=("Segoe UI", 22, "bold"),
            bg="#1E293B",
            fg="#F8FAFC"
        )
        lbl_titulo.pack(pady=(15,5))

        # CONTADOR
        self.lbl_contador = tk.Label(
            self.root,
            text="Total contactos: 0",
            font=("Segoe UI", 10, "bold"),
            bg="#1E293B",
            fg="#CBD5E1"
        )
        self.lbl_contador.pack(pady=(0,10))

        # FORMULARIO
        frame_form = tk.LabelFrame(
            self.root,
            text=" Datos del Contacto ",
            font=("Segoe UI", 12, "bold"),
            bg="#F8FAFC",
            fg="#0F172A",
            padx=15,
            pady=15
        )
        frame_form.pack(fill="x", padx=20, pady=10)

        estilo_label = {"bg":"#F8FAFC","font":("Segoe UI",10)}

        tk.Label(frame_form, text="Nombre:", **estilo_label).grid(row=0,column=0,sticky="w", pady=5)
        tk.Entry(frame_form, textvariable=self.var_nombre, width=30).grid(row=0,column=1,padx=10)

        tk.Label(frame_form, text="Email:", **estilo_label).grid(row=0,column=2,sticky="w")
        tk.Entry(frame_form, textvariable=self.var_email, width=30).grid(row=0,column=3,padx=10)

        tk.Label(frame_form, text="Teléfono:", **estilo_label).grid(row=1,column=0,sticky="w")
        tk.Entry(frame_form, textvariable=self.var_telefono, width=30).grid(row=1,column=1,padx=10)

        tk.Label(frame_form, text="Categoría:", **estilo_label).grid(row=1,column=2,sticky="w")

        combo = ttk.Combobox(
            frame_form,
            textvariable=self.var_categoria,
            values=["Clientes","Posibles socios","Personal"],
            state="readonly",
            width=27
        )
        combo.grid(row=1,column=3,padx=10)

        btn_guardar = tk.Button(
            frame_form,
            text="Guardar contacto",
            command=self.agregar_contacto,
            bg="#2563EB",
            fg="white",
            font=("Segoe UI",10,"bold"),
            relief="flat",
            cursor="hand2",
            pady=6
        )
        btn_guardar.grid(row=2,column=0,columnspan=4,pady=15, sticky="we")

        # BUSCADOR
        frame_busqueda = tk.Frame(self.root, bg="#1E293B")
        frame_busqueda.pack(fill="x", padx=20, pady=(5,0))

        tk.Label(
            frame_busqueda,
            text="Buscar:",
            bg="#1E293B",
            fg="#F8FAFC",
            font=("Segoe UI",10,"bold")
        ).pack(side="left")

        entry_buscar = tk.Entry(
            frame_busqueda,
            textvariable=self.var_busqueda
        )
        entry_buscar.pack(side="left", padx=10, fill="x", expand=True)

        entry_buscar.bind("<KeyRelease>", self.buscar_contacto)

        # TABLA
        columnas = ("nombre","telefono","email","categoria")

        style = ttk.Style()
        style.theme_use("default")

        style.configure(
            "Treeview",
            background="#F8FAFC",
            foreground="#0F172A",
            rowheight=28,
            fieldbackground="#F8FAFC",
            font=("Segoe UI",10)
        )

        style.configure(
            "Treeview.Heading",
            font=("Segoe UI",10,"bold")
        )

        self.tabla = ttk.Treeview(self.root, columns=columnas, show="headings")

        self.tabla.heading("nombre", text="Nombre")
        self.tabla.heading("telefono", text="Teléfono")
        self.tabla.heading("email", text="Email")
        self.tabla.heading("categoria", text="Categoría")

        self.tabla.column("nombre", width=180)
        self.tabla.column("telefono", width=120, anchor="center")
        self.tabla.column("email", width=220)
        self.tabla.column("categoria", width=120, anchor="center")

        self.tabla.pack(fill="both", expand=True, padx=20, pady=10)

        # BOTON ELIMINAR
        btn_eliminar = tk.Button(
            self.root,
            text="Eliminar seleccionado",
            command=self.eliminar_contacto,
            bg="#DC2626",
            fg="white",
            font=("Segoe UI",10,"bold"),
            relief="flat",
            cursor="hand2",
            pady=6
        )
        btn_eliminar.pack(pady=10)

    # LOGICA ORIGINAL

    def agregar_contacto(self):

        nombre = self.var_nombre.get().strip()
        telefono = self.var_telefono.get().strip()
        email = self.var_email.get().strip()
        categoria = self.var_categoria.get()

        if not nombre or not telefono:
            messagebox.showwarning("Error", "Nombre y Teléfono obligatorios")
            return

        nuevo = {
            "nombre": nombre,
            "telefono": telefono,
            "email": email if email else "N/A",
            "categoria": categoria
        }

        self.contactos.append(nuevo)

        self.actualizar_tabla()
        self.limpiar_campos()

        messagebox.showinfo("Éxito", f"{nombre} guardado")

    def eliminar_contacto(self):

        seleccion = self.tabla.selection()

        if not seleccion:
            messagebox.showwarning("Atención", "Selecciona un contacto")
            return

        item = self.tabla.item(seleccion)

        nombre_borrar = item["values"][0]

        self.contactos = [
            c for c in self.contactos
            if c["nombre"] != nombre_borrar
        ]

        self.actualizar_tabla()

    def buscar_contacto(self, event=None):

        texto = self.var_busqueda.get().lower()

        filtrados = [
            c for c in self.contactos
            if texto in c["nombre"].lower()
            or texto in c["telefono"]
        ]

        self.actualizar_tabla(filtrados)

    def actualizar_tabla(self, datos=None):

        for fila in self.tabla.get_children():
            self.tabla.delete(fila)

        lista = datos if datos else self.contactos

        for c in lista:
            self.tabla.insert(
                "",
                "end",
                values=(
                    c["nombre"],
                    c["telefono"],
                    c["email"],
                    c["categoria"]
                )
            )

        self.lbl_contador.config(
            text=f"Total contactos: {len(self.contactos)}"
        )

    def limpiar_campos(self):

        self.var_nombre.set("")
        self.var_telefono.set("")
        self.var_email.set("")
        self.var_categoria.set("General")


if __name__ == "__main__":
    root = tk.Tk()
    app = AgendaApp(root)
    root.mainloop()