-- V30: Update standard doctor desks to 1x1 footprint (fills 1 floor tile completely)
UPDATE clinic_catalog_items
SET footprint_x = 1, footprint_y = 1
WHERE id IN ('mesa_scandi', 'mesa_mogno_cafe', 'mesa_carrara');
