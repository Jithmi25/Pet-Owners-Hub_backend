import User from '../Models/userModel.js';
import Pet from '../Models/petModel.js';
import Shop from '../Models/shopModel.js';
import Clinic from '../Models/clinicModel.js';
import Transaction from '../Models/transactionModel.js';

// Helper function to filter data by date range
const filterByDateRange = (data, startDate, endDate, dateField = 'createdAt') => {
    if (!startDate || !endDate) return data;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    
    return data.filter(item => {
        const itemDate = new Date(item[dateField]);
        return itemDate >= start && itemDate <= end;
    });
};

// Get summary report
export const getSummaryReport = async (req, res) => {
    try {
        const { fromDate, toDate } = req.query;
        
        // Fetch all data
        const users = await User.find();
        const pets = await Pet.find();
        const transactions = await Transaction.find() || [];
        const shops = await Shop.find();
        const clinics = await Clinic.find();
        
        // Filter by date range
        const filteredUsers = filterByDateRange(users, fromDate, toDate);
        const filteredPets = filterByDateRange(pets, fromDate, toDate);
        const filteredTransactions = filterByDateRange(transactions, fromDate, toDate);
        
        // Calculate statistics
        const totalUsers = filteredUsers.length;
        const totalPets = filteredPets.length;
        const totalTransactions = filteredTransactions.length;
        
        // Calculate revenue (if transactions have amount field)
        const totalRevenue = filteredTransactions.reduce((sum, transaction) => {
            return sum + (transaction.amount || 0);
        }, 0);
        
        // Count active users (assumed to have status='active')
        const activeUsers = filteredUsers.filter(u => u.status === 'active').length;
        
        // Count verified shops and clinics
        const verifiedShops = shops.filter(s => s.isVerified === true).length;
        const verifiedClinics = clinics.filter(c => c.isVerified === true).length;
        
        // Trend calculation (compare with previous period)
        const periodDays = fromDate && toDate ? 
            Math.floor((new Date(toDate) - new Date(fromDate)) / (1000 * 60 * 60 * 24)) : 30;
        
        const previousStart = new Date(fromDate || new Date());
        previousStart.setDate(previousStart.getDate() - periodDays);
        const previousEnd = new Date(fromDate || new Date());
        
        const previousUsers = filterByDateRange(users, 
            previousStart.toISOString().split('T')[0], 
            previousEnd.toISOString().split('T')[0]
        ).length;
        const userTrend = previousUsers > 0 ? 
            Math.round(((totalUsers - previousUsers) / previousUsers) * 100) : 0;
        
        const previousPets = filterByDateRange(pets, 
            previousStart.toISOString().split('T')[0], 
            previousEnd.toISOString().split('T')[0]
        ).length;
        const petTrend = previousPets > 0 ? 
            Math.round(((totalPets - previousPets) / previousPets) * 100) : 0;
        
        const previousTransactions = filterByDateRange(transactions, 
            previousStart.toISOString().split('T')[0], 
            previousEnd.toISOString().split('T')[0]
        ).length;
        const transactionTrend = previousTransactions > 0 ? 
            Math.round(((totalTransactions - previousTransactions) / previousTransactions) * 100) : 0;
        
        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                activeUsers,
                userTrend,
                totalPets,
                petTrend,
                totalTransactions,
                transactionTrend,
                totalRevenue,
                verifiedShops,
                verifiedClinics,
                period: { fromDate, toDate }
            }
        });
    } catch (error) {
        console.error('Error fetching summary report:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching summary report',
            error: error.message 
        });
    }
};

// Get user activity report
export const getUserActivityReport = async (req, res) => {
    try {
        const { fromDate, toDate, limit = 100 } = req.query;
        
        let users = await User.find().sort({ createdAt: -1 }).limit(parseInt(limit));
        users = filterByDateRange(users, fromDate, toDate);
        
        const userActivity = users.map(user => ({
            id: user._id,
            name: user.username || user.firstName + ' ' + user.lastName,
            email: user.email,
            status: user.status,
            joinedDate: user.createdAt,
            lastActive: user.updatedAt,
            userType: user.userType || 'user'
        }));
        
        res.status(200).json({
            success: true,
            data: {
                totalUsers: userActivity.length,
                users: userActivity,
                period: { fromDate, toDate }
            }
        });
    } catch (error) {
        console.error('Error fetching user activity report:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching user activity report',
            error: error.message 
        });
    }
};

// Get pet listings report
export const getPetListingsReport = async (req, res) => {
    try {
        const { fromDate, toDate, limit = 100 } = req.query;
        
        let pets = await Pet.find().sort({ createdAt: -1 }).limit(parseInt(limit));
        pets = filterByDateRange(pets, fromDate, toDate);
        
        // Group by type
        const petsByType = {};
        pets.forEach(pet => {
            const type = pet.petType || 'Unknown';
            petsByType[type] = (petsByType[type] || 0) + 1;
        });
        
        const petListings = pets.map(pet => ({
            id: pet._id,
            name: pet.name,
            type: pet.petType,
            breed: pet.breed,
            owner: pet.ownerId,
            status: pet.status || 'available',
            listedDate: pet.createdAt
        }));
        
        res.status(200).json({
            success: true,
            data: {
                totalListings: petListings.length,
                petsByType,
                listings: petListings,
                period: { fromDate, toDate }
            }
        });
    } catch (error) {
        console.error('Error fetching pet listings report:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching pet listings report',
            error: error.message 
        });
    }
};

// Get transactions report
export const getTransactionsReport = async (req, res) => {
    try {
        const { fromDate, toDate, limit = 100 } = req.query;
        
        let transactions = await Transaction.find().sort({ createdAt: -1 }).limit(parseInt(limit));
        if (!transactions) transactions = [];
        transactions = filterByDateRange(transactions, fromDate, toDate);
        
        const totalRevenue = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
        const avgTransaction = transactions.length > 0 ? totalRevenue / transactions.length : 0;
        
        const transactionList = transactions.map(t => ({
            id: t._id,
            amount: t.amount || 0,
            buyer: t.buyerId,
            seller: t.sellerId,
            status: t.status || 'completed',
            type: t.type || 'purchase',
            date: t.createdAt
        }));
        
        res.status(200).json({
            success: true,
            data: {
                totalTransactions: transactionList.length,
                totalRevenue,
                averageTransaction: avgTransaction.toFixed(2),
                transactions: transactionList,
                period: { fromDate, toDate }
            }
        });
    } catch (error) {
        console.error('Error fetching transactions report:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching transactions report',
            error: error.message 
        });
    }
};

// Get user growth over time
export const getUserGrowthReport = async (req, res) => {
    try {
        const { fromDate, toDate } = req.query;
        
        const users = await User.find();
        
        // Generate daily user counts
        const userGrowth = {};
        users.forEach(user => {
            const date = new Date(user.createdAt).toISOString().split('T')[0];
            if (!userGrowth[date]) {
                userGrowth[date] = 0;
            }
            userGrowth[date]++;
        });
        
        // Sort by date and create cumulative growth
        const sortedDates = Object.keys(userGrowth).sort();
        const growthData = [];
        let cumulativeCount = 0;
        
        sortedDates.forEach(date => {
            cumulativeCount += userGrowth[date];
            growthData.push({
                date,
                newUsers: userGrowth[date],
                totalUsers: cumulativeCount
            });
        });
        
        res.status(200).json({
            success: true,
            data: {
                growthData,
                period: { fromDate, toDate }
            }
        });
    } catch (error) {
        console.error('Error fetching user growth report:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching user growth report',
            error: error.message 
        });
    }
};

// Get pet listings by type
export const getPetListingsByTypeReport = async (req, res) => {
    try {
        const pets = await Pet.find();
        
        const petsByType = {};
        pets.forEach(pet => {
            const type = pet.petType || 'Unknown';
            if (!petsByType[type]) {
                petsByType[type] = 0;
            }
            petsByType[type]++;
        });
        
        const typeData = Object.entries(petsByType).map(([type, count]) => ({
            type,
            count,
            percentage: ((count / pets.length) * 100).toFixed(2)
        }));
        
        res.status(200).json({
            success: true,
            data: {
                totalListings: pets.length,
                byType: typeData
            }
        });
    } catch (error) {
        console.error('Error fetching pet type report:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching pet type report',
            error: error.message 
        });
    }
};

// Export report data as CSV
export const exportReportAsCSV = async (req, res) => {
    try {
        const { reportType, fromDate, toDate } = req.query;
        
        let csvData = '';
        let filename = `report_${reportType}_${new Date().toISOString().split('T')[0]}.csv`;
        
        if (reportType === 'summary') {
            const report = await getSummaryReportData(fromDate, toDate);
            csvData = generateSummaryCsv(report);
        } else if (reportType === 'users') {
            const report = await getUserActivityData(fromDate, toDate);
            csvData = generateUsersCsv(report);
        } else if (reportType === 'pets') {
            const report = await getPetListingsData(fromDate, toDate);
            csvData = generatePetsCsv(report);
        } else if (reportType === 'transactions') {
            const report = await getTransactionsData(fromDate, toDate);
            csvData = generateTransactionsCsv(report);
        }
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(csvData);
    } catch (error) {
        console.error('Error exporting report:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error exporting report',
            error: error.message 
        });
    }
};

// Helper functions for CSV generation
async function getSummaryReportData(fromDate, toDate) {
    const users = await User.find();
    const pets = await Pet.find();
    const transactions = await Transaction.find() || [];
    
    return {
        users: filterByDateRange(users, fromDate, toDate),
        pets: filterByDateRange(pets, fromDate, toDate),
        transactions: filterByDateRange(transactions, fromDate, toDate)
    };
}

async function getUserActivityData(fromDate, toDate) {
    let users = await User.find();
    return filterByDateRange(users, fromDate, toDate);
}

async function getPetListingsData(fromDate, toDate) {
    let pets = await Pet.find();
    return filterByDateRange(pets, fromDate, toDate);
}

async function getTransactionsData(fromDate, toDate) {
    let transactions = await Transaction.find() || [];
    return filterByDateRange(transactions, fromDate, toDate);
}

function generateSummaryCsv(data) {
    const lines = [];
    lines.push('Report Summary');
    lines.push('Generated,' + new Date().toISOString());
    lines.push('');
    lines.push('Metric,Value');
    lines.push('Total Users,' + data.users.length);
    lines.push('Total Pets,' + data.pets.length);
    lines.push('Total Transactions,' + data.transactions.length);
    const revenue = data.transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
    lines.push('Total Revenue,' + revenue);
    
    return lines.join('\n');
}

function generateUsersCsv(users) {
    const lines = [];
    lines.push('ID,Name,Email,Status,Joined Date');
    users.forEach(user => {
        const name = user.username || (user.firstName + ' ' + user.lastName);
        lines.push(`"${user._id}","${name}","${user.email}","${user.status}","${new Date(user.createdAt).toISOString()}"`);
    });
    return lines.join('\n');
}

function generatePetsCsv(pets) {
    const lines = [];
    lines.push('ID,Name,Type,Breed,Status,Listed Date');
    pets.forEach(pet => {
        lines.push(`"${pet._id}","${pet.name}","${pet.petType}","${pet.breed}","${pet.status}","${new Date(pet.createdAt).toISOString()}"`);
    });
    return lines.join('\n');
}

function generateTransactionsCsv(transactions) {
    const lines = [];
    lines.push('ID,Amount,Buyer,Seller,Status,Type,Date');
    transactions.forEach(t => {
        lines.push(`"${t._id}","${t.amount}","${t.buyerId}","${t.sellerId}","${t.status}","${t.type}","${new Date(t.createdAt).toISOString()}"`);
    });
    return lines.join('\n');
}

// Get all reports data for dashboard
export const getAllReportsData = async (req, res) => {
    try {
        const { fromDate, toDate } = req.query;
        
        const users = await User.find();
        const pets = await Pet.find();
        const transactions = await Transaction.find() || [];
        const shops = await Shop.find();
        const clinics = await Clinic.find();
        
        const filteredUsers = filterByDateRange(users, fromDate, toDate);
        const filteredPets = filterByDateRange(pets, fromDate, toDate);
        const filteredTransactions = filterByDateRange(transactions, fromDate, toDate);
        
        const totalRevenue = filteredTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);
        
        res.status(200).json({
            success: true,
            data: {
                summary: {
                    totalUsers: filteredUsers.length,
                    totalPets: filteredPets.length,
                    totalTransactions: filteredTransactions.length,
                    totalRevenue,
                    verifiedShops: shops.filter(s => s.isVerified).length,
                    verifiedClinics: clinics.filter(c => c.isVerified).length
                },
                users: filteredUsers.map(u => ({
                    id: u._id,
                    name: u.username || (u.firstName + ' ' + u.lastName),
                    email: u.email,
                    status: u.status,
                    joined: u.createdAt
                })),
                pets: filteredPets.map(p => ({
                    id: p._id,
                    name: p.name,
                    type: p.petType,
                    status: p.status,
                    listed: p.createdAt
                })),
                transactions: filteredTransactions.map(t => ({
                    id: t._id,
                    amount: t.amount,
                    status: t.status,
                    date: t.createdAt
                }))
            }
        });
    } catch (error) {
        console.error('Error fetching all reports:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching reports',
            error: error.message 
        });
    }
};
