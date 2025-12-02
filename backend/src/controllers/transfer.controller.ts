import { Request, Response } from 'express';
import { ethers } from 'ethers';
import providerService, { NetworkType } from '../services/provider.service';

export class TransferController {
    // Transfer native tokens (ETH, QIE)
    async transferNative(req: Request, res: Response) {
        try {
            const { to, amount, chain } = req.body;

            if (!to || !amount || !chain) {
                return res.status(400).json({
                    success: false,
                    error: 'Missing required fields: to, amount, chain'
                });
            }

            if (!providerService.isNetworkConfigured(chain as NetworkType)) {
                return res.status(400).json({
                    success: false,
                    error: `Network ${chain} is not configured`
                });
            }

            const wallet = providerService.getWallet(chain as NetworkType);

            const tx = await wallet.sendTransaction({
                to,
                value: ethers.parseEther(amount.toString())
            });

            const receipt = await tx.wait();

            res.json({
                success: true,
                txHash: receipt?.hash,
                network: chain
            });

        } catch (error: any) {
            console.error('Transfer error:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Transfer failed'
            });
        }
    }

    // Get native balance
    async getBalance(req: Request, res: Response) {
        try {
            const { address, chain } = req.params;

            if (!providerService.isNetworkConfigured(chain as NetworkType)) {
                return res.status(400).json({
                    success: false,
                    error: `Network ${chain} is not configured`
                });
            }

            const provider = providerService.getProvider(chain as NetworkType);
            const balance = await provider.getBalance(address);

            res.json({
                success: true,
                address,
                chain,
                balance: ethers.formatEther(balance)
            });

        } catch (error: any) {
            console.error('Get balance error:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to get balance'
            });
        }
    }

    // Get supported networks
    async getNetworks(req: Request, res: Response) {
        res.json({
            success: true,
            networks: providerService.getAvailableNetworks()
        });
    }
}

export default new TransferController();
