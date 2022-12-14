import { PrismaClient } from '@prisma/client';
import { Response, Request, NextFunction } from 'express';

const prisma = new PrismaClient({ log: ['query', 'info'] });

const artistController = {
    getArtist: async (req: Request, res: Response, _next: NextFunction): Promise<any> => {
        const { name, category, token } = req.query;
        try {
            if (name) {
                const artistByName = await prisma.artista.findMany({
                    select: {
                        id: true,
                        name: true,
                        img: true
                    },
                    where: {
                        name: {
                            search: `${name}`
                        }
                    }
                });
                if (artistByName.length > 0) {
                    return res.status(200).json(artistByName);
                } else {
                    throw `No se encontraron artistas con el nombre de »${name}«.`;
                }
            } else if (category) {
                const artistByIdCategory = await prisma.eventosCategorias.findMany({
                    select: {
                        eventos: {
                            select: {
                                artista: {
                                    select: {
                                        id: true,
                                        name: true,
                                        img: true
                                    }
                                }
                            }
                        }
                    },
                    where: {
                        idCategoria: `${category}`
                    }
                });
                if (artistByIdCategory.length > 0) {
                    res.send(artistByIdCategory);
                } else {
                    throw 'No se encontraron artistas con la categoría seleccionada';
                }
            } else if (token) {
                const getIdByToken = await prisma.artista.findMany({
                    select: {
                        id: true
                    },
                    where: {
                        usuario: {
                            token: `${token}`
                        }
                    }
                });
                if (getIdByToken.length > 0) {
                    return res.status(200).json(getIdByToken);
                } else {
                    throw `No se encontraron usuarios vinculados al token.`;
                }
            } else {
                const artists = await prisma.artista.findMany({
                    select: {
                        id: true,
                        name: true,
                        img: true
                    }
                });
                if (artists.length > 0) {
                    return res.status(200).json(artists);
                } else {
                    throw `No se encontraron resultados.`;
                }
            }
        } catch (error) {
            return res.status(400).json({
                message: error
            });
        }
    },
    getArtistById: async (req: Request, res: Response, _next: NextFunction): Promise<any> => {
        const { id } = req.params;
        try {
            const artist = await prisma.artista.findFirst({
                select: {
                    id: true,
                    name: true,
                    descripcion: true,
                    img: true,
                    usuario: {
                        select: {
                            persona: {
                                select: {
                                    name: true,
                                    lastname: true,
                                    city: true,
                                    country: true
                                }
                            }
                        }
                    }
                },
                where: { id }
            });
            if (artist) {
                return res.status(200).json(artist);
            } else {
                throw `No se encontró el artista por el id »${id}«.`;
            }
        } catch (error) {
            return res.status(400).json({
                message: error
            });
        }
    },
    createArtist: async (req: Request, res: Response, _next: NextFunction): Promise<any> => {
        const { name, img, descripcion, idUsuario } = req.body;
        try {
            const isUsuario = await prisma.usuario.findUnique({
                where: { id: idUsuario }
            });

            if (!isUsuario) {
                throw 'Ocurrió un problema al crear el artista, se necesita ser usuario para poder ser artista.';
            }

            const isArtist: any = await prisma.artista.findMany({
                where: {
                    OR: [{ name }, { AND: { idUsuario: idUsuario } }]
                }
            });

            if (isArtist.length > 0) {
                throw `Ya hay un artista con el nombre ${name} o el id ${idUsuario}, verifica nuevamente por favor.`;
            }

            const createArtist = await prisma.artista.create({
                data: {
                    name: `${name}`,
                    img: `${img}`,
                    descripcion: `${descripcion}`,
                    idUsuario: `${idUsuario}`
                }
            });

            if (!createArtist) {
                throw 'Ocurrió un error al crear el artista, intenta nuevamente.';
            }

            return res.status(201).json(createArtist);
        } catch (error) {
            return res.status(400).json({
                message: error
            });
        }
    }
}

export default artistController;