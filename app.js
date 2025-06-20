const form = document.getElementById('trade-form');
    const tbody = document.querySelector('#tabla-operaciones tbody');
    let editIndex = null; // Nueva variable para saber si estamos editando

    function cargarOperaciones() {
      const datos = JSON.parse(localStorage.getItem('trades') || '[]');
      tbody.innerHTML = '';
      datos.forEach((op, idx) => {
        const fila = tbody.insertRow();
        Object.values(op).forEach(valor => {
          const celda = fila.insertCell();
          celda.textContent = valor;
        });
        // Celda de acciones
        const celdaAcciones = fila.insertCell();
        celdaAcciones.innerHTML = `
          <button onclick="editarOperacion(${idx})">Editar</button>
          <button onclick="eliminarOperacion(${idx})">Eliminar</button>
        `;
      });
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const trade = {
        fecha: document.getElementById('fecha').value,
        par: document.getElementById('par').value,
        tipo: document.getElementById('tipo').value,
        entrada: document.getElementById('entrada').value,
        salida: document.getElementById('salida').value,
        sl: document.getElementById('sl').value,
        tp: document.getElementById('tp').value,
        resultado: document.getElementById('resultado').value,
        emocion: document.getElementById('emocion').value,
        comentario: document.getElementById('comentario').value,
      };

      const operaciones = JSON.parse(localStorage.getItem('trades') || '[]');
      if (editIndex !== null) {
        operaciones[editIndex] = trade; // Editar
        editIndex = null;
      } else {
        operaciones.push(trade); // Agregar nuevo
      }
      localStorage.setItem('trades', JSON.stringify(operaciones));
      form.reset();
      cargarOperaciones();
    });

    function descargarCSV() {
      const datos = JSON.parse(localStorage.getItem('trades') || '[]');
      if (datos.length === 0) {
        alert('No hay datos para exportar');
        return;
      }

      const encabezados = Object.keys(datos[0]);
      const filas = datos.map(op => encabezados.map(h => op[h]).join(','));
      const csv = [encabezados.join(','), ...filas].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'registro_trading.csv';
      a.click();
    }

    function limpiarTodo() {
      if (confirm('¿Estás seguro de borrar todo el registro?')) {
        localStorage.removeItem('trades');
        cargarOperaciones();
      }
    }

    function eliminarOperacion(idx) {
      const datos = JSON.parse(localStorage.getItem('trades') || '[]');
      if (confirm('¿Eliminar esta operación?')) {
        datos.splice(idx, 1);
        localStorage.setItem('trades', JSON.stringify(datos));
        cargarOperaciones();
      }
    }

    function editarOperacion(idx) {
      const datos = JSON.parse(localStorage.getItem('trades') || '[]');
      const op = datos[idx];
      document.getElementById('fecha').value = op.fecha;
      document.getElementById('par').value = op.par;
      document.getElementById('tipo').value = op.tipo;
      document.getElementById('entrada').value = op.entrada;
      document.getElementById('salida').value = op.salida;
      document.getElementById('sl').value = op.sl;
      document.getElementById('tp').value = op.tp;
      document.getElementById('resultado').value = op.resultado;
      document.getElementById('emocion').value = op.emocion;
      document.getElementById('comentario').value = op.comentario;
      editIndex = idx; // Indica que estamos editando
    }

    cargarOperaciones();