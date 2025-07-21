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

  return (
    <div style={{ maxWidth: 600, margin: "auto", fontFamily: "Arial" }}>
      <h2>Elige productos y cantidad</h2>
      <table
        width="100%"
        border="1"
        cellPadding="8"
        style={{ borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th>Producto/Servicio</th>
            <th>Precio unitario</th>
            <th>Cantidad (0-100)</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id}>
              <td>{p.nombre}</td>
              <td>${p.precio.toFixed(2)}</td>
              <td>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={cantidades[p.id] || 0}
                  onChange={(e) => handleCantidadChange(p.id, e.target.value)}
                  style={{ width: 60 }}
                />
              </td>
              <td>${(p.precio * cantidades[p.id]).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Total: ${total.toFixed(2)}</h3>

      <button
        onClick={generarRecibo}
        style={{
          padding: "10px 20px",
          fontSize: 16,
          marginTop: 10,
          cursor: "pointer",
        }}
      >
        Generar Recibo
      </button>

      {recibo && (
        <div style={{ marginTop: 30, padding: 20, border: "1px solid #333" }}>
          <h3>Recibo generado</h3>
          <p>
            <strong>PIN:</strong> {recibo.pin}
          </p>
          <p>
            <strong>Total:</strong> ${recibo.total.toFixed(2)}
          </p>
          <table
            width="100%"
            border="1"
            cellPadding="6"
            style={{ borderCollapse: "collapse" }}
          >
            <thead>
              <tr>
                <th>Producto</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {recibo.detalles.map((item, i) => (
                <tr key={i}>
                  <td>{item.nombre}</td>
                  <td>${item.precio.toFixed(2)}</td>
                  <td>{item.cantidad}</td>
                  <td>${item.subtotal.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
