import React, { useState } from "react";

const productos = [
  { id: 1, nombre: "BONO COD SOCIO", precio: 14000 },
  { id: 2, nombre: "BONO COD NO SOCIO", precio: 21000 },
  { id: 3, nombre: "BONO CNP SOCIO", precio: 12000 },
  { id: 4, nombre: "BONO CNP NO SOCIO", precio: 18000 },
];

// Genera PIN de 16 caracteres alfanuméricos divididos en bloques de 4
function generarPIN() {
  const chars =
    "aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ0123456789";
  let pin = "";
  for (let i = 0; i < 16; i++) {
    pin += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pin.match(/.{1,4}/g).join("-");
}

export default function App() {
  const [cantidades, setCantidades] = useState(
    productos.reduce((acc, p) => ({ ...acc, [p.id]: 1 }), {})
  );
  const [recibo, setRecibo] = useState(null);

  const handleCantidadChange = (id, value) => {
    const cantidad = Math.min(100, Math.max(0, Number(value) || 0)); // 0 a 100
    setCantidades({ ...cantidades, [id]: cantidad });
  };

  const total = productos.reduce(
    (sum, p) => sum + p.precio * (cantidades[p.id] || 0),
    0
  );

  const generarRecibo = () => {
    const pin = generarPIN();
    setRecibo({
      pin,
      total,
      detalles: productos
        .filter((p) => cantidades[p.id] > 0)
        .map((p) => ({
          nombre: p.nombre,
          precio: p.precio,
          cantidad: cantidades[p.id],
          subtotal: p.precio * cantidades[p.id],
        })),
    });
  };

  // Estilos
  const estilos = {
    contenedor: {
      maxWidth: 600,
      margin: "auto",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: "#a80000",
      backgroundColor: "#fff",
      padding: 20,
      borderRadius: 8,
      boxShadow: "0 0 15px rgba(168, 0, 0, 0.3)",
    },
    titulo: {
      textAlign: "center",
      marginBottom: 20,
      fontWeight: "bold",
      fontSize: 28,
      color: "#a80000",
      textTransform: "uppercase",
      letterSpacing: 2,
    },
    tabla: {
      width: "100%",
      borderCollapse: "collapse",
      marginBottom: 20,
    },
    th: {
      borderBottom: "2px solid #a80000",
      padding: 10,
      color: "#a80000",
      textAlign: "left",
      backgroundColor: "#feeaea",
      fontWeight: "600",
    },
    td: {
      borderBottom: "1px solid #ddd",
      padding: 10,
    },
    inputCantidad: {
      width: 60,
      padding: 6,
      borderRadius: 4,
      border: "1px solid #a80000",
      color: "#a80000",
      fontWeight: "600",
      textAlign: "center",
    },
    boton: {
      backgroundColor: "#a80000",
      color: "#fff",
      border: "none",
      padding: "12px 24px",
      fontSize: 18,
      cursor: "pointer",
      borderRadius: 6,
      fontWeight: "bold",
      width: "100%",
      transition: "background-color 0.3s",
    },
    botonHover: {
      backgroundColor: "#7a0000",
    },
    reciboContenedor: {
      marginTop: 30,
      padding: 20,
      border: "2px solid #a80000",
      borderRadius: 8,
      backgroundColor: "#fff0f0",
      color: "#7a0000",
      boxShadow: "0 0 10px rgba(168, 0, 0, 0.25)",
    },
    reciboTitulo: {
      marginBottom: 10,
      fontWeight: "bold",
      fontSize: 22,
      textAlign: "center",
      textTransform: "uppercase",
    },
    reciboTexto: {
      fontSize: 16,
      marginBottom: 8,
    },
  };

  return (
    <div className="App" style={estilos.contenedor}>
      <h2 style={estilos.titulo}>Elige productos y cantidad</h2>
      <table style={estilos.tabla}>
        <thead>
          <tr>
            <th style={estilos.th}>Producto/Servicio</th>
            <th style={estilos.th}>Precio unitario</th>
            <th style={estilos.th}>Cantidad (0-100)</th>
            <th style={estilos.th}>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id}>
              <td style={estilos.td}>{p.nombre}</td>
              <td style={estilos.td}>${p.precio.toFixed(2)}</td>
              <td style={estilos.td}>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={cantidades[p.id] || 0}
                  onChange={(e) => handleCantidadChange(p.id, e.target.value)}
                  style={estilos.inputCantidad}
                />
              </td>
              <td style={estilos.td}>
                ${(p.precio * (cantidades[p.id] || 0)).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ color: "#a80000", fontWeight: "bold", textAlign: "right" }}>
        Total: ${total.toFixed(2)}
      </h3>

      <button
        style={estilos.boton}
        onClick={generarRecibo}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#7a0000")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#a80000")}
      >
        Generar Recibo
      </button>

      {recibo && (
        <div style={estilos.reciboContenedor}>
          <h3 style={estilos.reciboTitulo}>Recibo generado</h3>
          <p style={estilos.reciboTexto}>
            <strong>PIN:</strong> {recibo.pin}
          </p>
          <p style={estilos.reciboTexto}>
            <strong>Total:</strong> ${recibo.total.toFixed(2)}
          </p>
          <table style={{ ...estilos.tabla, marginTop: 10 }}>
            <thead>
              <tr>
                <th style={estilos.th}>Producto</th>
                <th style={estilos.th}>Precio</th>
                <th style={estilos.th}>Cantidad</th>
                <th style={estilos.th}>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {recibo.detalles.map((item, i) => (
                <tr key={i}>
                  <td style={estilos.td}>{item.nombre}</td>
                  <td style={estilos.td}>${item.precio.toFixed(2)}</td>
                  <td style={estilos.td}>{item.cantidad}</td>
                  <td style={estilos.td}>${item.subtotal.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
