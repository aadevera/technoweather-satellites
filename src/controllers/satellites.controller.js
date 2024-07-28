const satellites = [
  {
    label: 'Base Earth',
    src: 'img/base-earth.jpeg',
  },
  {
    label: 'GFSC NASA',
    src: 'img/satellites/gsfc_nasa.png',
  },
  {
    label: 'Composite Satellites (GOES, HIMAWARI, METEOSTAT, GK2A)',
    src: 'img/satellites/composite-satellites.jpg',
  },
];

module.exports = {
  getAll: async (req, res) => {
    return res.status(200).json({
      data: satellites,
    });
  },
  delete: (req, res) => {},
  upload: async (req, res) => {
    const { label } = req.body;

    if (!label || !req.file) {
      return res.status(422).json({ message: 'Invalid Request.' });
    }

    const { filename } = req.file;

    satellites.push({
      label,
      src: `img/uploads/${filename}`,
    });

    return res.status(200).json({
      message: 'OK',
    });
  },
};
