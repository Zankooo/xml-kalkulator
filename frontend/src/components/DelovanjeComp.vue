<script setup>
</script>

<template>

  <section class="form-page">
    <div class="content-card">
      <h2>Namen</h2>

      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas euismod, nisl non porta
        placerat, urna arcu condimentum est, nec sagittis sapien leo id magna.
      </p>  
    </div>

    <div class="content-card">
      <h2>Delovanje</h2>

      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas euismod, nisl non porta
        placerat, urna arcu condimentum est, nec sagittis sapien leo id magna.
      </p>

      <p>
        Integer fermentum, justo vitae hendrerit gravida, magna nisi euismod urna, in aliquet turpis
        erat quis urna. Donec vitae lacinia urna. Aenean maximus suscipit velit, sit amet cursus
        magna luctus at.
      </p>
       <p>
        Integer fermentum, justo vitae hendrerit gravida, magna nisi euismod urna, in aliquet turpis
        erat quis urna. Donec vitae lacinia urna. Aenean maximus suscipit velit, sit amet cursus
        magna luctus at.
      </p>
       <p>
        Integer fermentum, justo vitae hendrerit gravida, magna nisi euismod urna, in aliquet turpis
        erat quis urna. Donec vitae lacinia urna. Aenean maximus suscipit velit, sit amet cursus
        magna luctus at.
      </p>
       <p>
        Integer fermentum, justo vitae hendrerit gravida, magna nisi euismod urna, in aliquet turpis
        erat quis urna. Donec vitae lacinia urna. Aenean maximus suscipit velit, sit amet cursus
        magna luctus at.
      </p>
       <p>
        Integer fermentum, justo vitae hendrerit gravida, magna nisi euismod urna, in aliquet turpis
        erat quis urna. Donec vitae lacinia urna. Aenean maximus suscipit velit, sit amet cursus
        magna luctus at.
      </p>
       <p>
        Integer fermentum, justo vitae hendrerit gravida, magna nisi euismod urna, in aliquet turpis
        erat quis urna. Donec vitae lacinia urna. Aenean maximus suscipit velit, sit amet cursus
        magna luctus at.
      </p>

      
    </div>

  </section>


</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap");

*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background: #f3f4f6;
  color: #111827;
  overflow-y: auto;
}

/* Page layout */






/* Card layout (form design reused) */


.content-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 20px 24px 22px;
  width: 100%;
  max-width: 1000px;
  box-shadow:
    0 8px 20px rgba(15, 23, 42, 0.08),
    0 0 0 1px rgba(209, 213, 219, 0.7);
}

.content-card h2 {
  text-align: center;
  margin-bottom: 14px;
  font-size: 20px;
  font-weight: 600;
  color: #111827;
}

.content-card p {
  text-align: center;
  font-size: 14px;
  color: #374151;
  margin-bottom: 14px;
}

.form-page {
  display: flex;
  flex-direction: column;  /* <-- dodamo to */
  align-items: center;     /* center cardov */
  gap: 24px;               /* razmik med karticami */
  padding: 30px 16px 32px;
  background: #f3f4f6;
  width: 100%;
}




</style>
